window.Firehose = {}

class Firehose.Transport
  # Class method to determine whether transport is supported by the current browser. Note that while
  # the transport may be supported by the browser, its possible that the network connection won't 
  # succeed. That should be accounted for during the initial connecting to the server.
  @supported: =>
    false

  constructor: (config={}) ->
    @config      = config
    @_retryDelay = 3000
    @

  # Lets rock'n'roll! Connect to the server.
  connect: (delay = 0) =>
    setTimeout @_request, delay
    this

  # Hey subclasses:
  name: ->     throw 'not implemented in base Transport' # implement this to identify transport type
  stop: ->     throw 'not implemented in base Transport' # implement this to stop receiving messages
  _request: -> throw 'not implemented in base Transport' # implement this to handle requests

  # Default error handler
  _error: (event) =>
    if @_succeeded
      # Lets try to connect again with delay
      @config.disconnected()
      @connect(@_retryDelay)
    else @config.failed @

  # Default connection established handler
  _open: (event) =>
    @_succeeded = true
    @config.connected(@)

  # Default connection closed handler
  _close: (event) =>
    @config.disconnected()

  # Useful for reconnecting after any networking hiccups
  getLastMessageSequence: =>
    @_lastMessageSequence or 0

class Firehose.LongPoll extends Firehose.Transport
  messageSequenceHeader: 'Pragma'
  name: -> 'LongPoll'

  # CORS is kinda supported in IE8+ except that its implementation cannot
  # access "simple request" response headers. This means we don't yet have a
  # plan to support IE<10 (when it gets a real XHR2 implementation). Sucks...
  # $.browser.msie and parseInt($.browser.version) >= 8 # DEPRECATED
  @ieSupported: -> (document.documentMode || 10) > 8

  @supported: ->
    # IE 8+, FF 3.5+, Chrome 4+, Safari 4+, Opera 12+, iOS 3.2+, Android 2.1+
    if xhr = $.ajaxSettings.xhr()
      "withCredentials" of xhr || Firehose.LongPoll.ieSupported()

  constructor: (args) ->
    super args

    @config.ssl ?= false

    # Configrations specifically for long polling
    @config.longPoll         ||= {}
    @config.longPoll.url     ||= "#{@_protocol()}:#{@config.uri}"
    # How many ms should we wait before timing out the AJAX connection?
    @config.longPoll.timeout ||= 25000
    # TODO - What is @_lagTime for? Can't we just use the @_timeout value?
    # We use the lag time to make the client live longer than the server.
    @_lagTime         = 5000
    @_timeout         = @config.longPoll.timeout + @_lagTime
    @_okInterval      = @config.okInterval || 0
    @_stopRequestLoop = false

  # Protocol schema we should use for talking to firehose server.
  _protocol: =>
    if @config.ssl then "https" else "http"

  _request: =>
    return if @_stopRequestLoop
    # Set the Last Message Sequence in a query string.
    # Ideally we'd use an HTTP header, but android devices don't let us
    # set any HTTP headers for CORS requests.
    data = @config.params
    data.last_message_sequence = @_lastMessageSequence
    # TODO: Some of these options will be deprecated in jQuery 1.8
    #       See: http://api.jquery.com/jQuery.ajax/#jqXHR
    @_lastRequest = $.ajax
      url:          @config.longPoll.url
      firehose:     true
      crossDomain:  true
      data:         data
      timeout:      @_timeout
      success:      @_success
      error:        @_error
      cache:        false

  stop: =>
    @_stopRequestLoop = true
    if @_lastRequest?
      try @_lastRequest.abort() catch e
      delete @_lastRequest
    if @_lastPingRequest?
      try @_lastPingRequest.abort() catch e
      delete @_lastPingRequest

  _success: (data, status, jqXhr) =>
    if @_needToNotifyOfReconnect or not @_succeeded
      @_needToNotifyOfReconnect = false
      @_open data
    return if @_stopRequestLoop
    if jqXhr.status is 200
      # Of course, IE's XDomainRequest doesn't support non-200 success codes.
      try
        {message, last_sequence} = JSON.parse jqXhr.responseText
        @_lastMessageSequence    = last_sequence
        @config.message @config.parse message
      catch e
    @connect @_okInterval

  _ping: =>
    # Ping long poll server to verify internet connectivity
    # jQuery CORS doesn't support timeouts and there is no way to access xhr2 object
    # directly so we can't manually set a timeout.
    @_lastPingRequest = $.ajax
      url:          @config.longPoll.url
      method:       'HEAD'
      crossDomain:  true
      firehose:     true
      data:         @config.params
      success:      =>
        if @_needToNotifyOfReconnect
          @_needToNotifyOfReconnect = false
          @config.connected @

  # We need this custom handler to have the connection status
  # properly displayed
  _error: (jqXhr, status, error) =>
    unless @_needToNotifyOfReconnect or @_stopRequestLoop
      @_needToNotifyOfReconnect = true
      @config.disconnected()
    unless @_stopRequestLoop
      # Ping the server to make sure this isn't a network connectivity error
      setTimeout @_ping, @_retryDelay + @_lagTime
      # Reconnect with delay
      setTimeout @_request, @_retryDelay

# Let's try to hack in support for IE8-9 via the XDomainRequest object!
# This was adapted from code shamelessly stolen from:
# https://github.com/jaubourg/ajaxHooks/blob/master/src/ajax/xdr.js
if $?.browser?.msie and parseInt($.browser.version, 10) in [8, 9]
  jQuery.ajaxTransport (s) ->
    if s.crossDomain and s.async and s.firehose
      if s.timeout
        s.xdrTimeout = s.timeout
        delete s.timeout
      xdr = undefined
      return {
        send: (_, complete) ->
          callback = (status, statusText, responses, responseHeaders) ->
            xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop
            xdr = undefined
            complete status, statusText, responses, responseHeaders
          xdr = new XDomainRequest()
          xdr.open s.type, s.url
          xdr.onload = ->
            headers = "Content-Type: #{xdr.contentType}"
            callback 200, "OK", {text: xdr.responseText}, headers
          xdr.onerror = -> callback 404, "Not Found"
          if s.xdrTimeout?
            xdr.ontimeout = -> callback 0, "timeout"
            xdr.timeout   = s.xdrTimeout
          xdr.send (s.hasContent and s.data) or null
        abort: ->
          if xdr?
            xdr.onerror = jQuery.noop()
            xdr.abort()
      }

INITIAL_PING_TIMEOUT   =  2000
KEEPALIVE_PING_TIMEOUT = 20000

class Firehose.WebSocket extends Firehose.Transport
  name: -> 'WebSocket'

  @ieSupported:-> (document.documentMode || 10) > 9
  @supported  :-> window.WebSocket? # Check if WebSocket is an object in the window.

  constructor: (args) ->
    super args
    # Configrations specifically for web sockets
    @config.webSocket ||= {}
    @config.webSocket.connectionVerified = @config.connectionVerified

  _request: =>
    # Run this is a try/catch block because IE10 inside of a .NET control
    # complains about security zones.
    try
      @socket = new window.WebSocket "#{@_protocol()}:#{@config.uri}?#{$.param @config.params}"
      @socket.onopen    = @_open
      @socket.onclose   = @_close
      @socket.onerror   = @_error
      @socket.onmessage = @_lookForInitialPong
    catch err
      console?.log(err)

  # Protocol schema we should use for talking to firehose server.
  _protocol: =>
    if @config.ssl then "wss" else "ws"

  _open: =>
    sendPing @socket

  _lookForInitialPong: (event) =>
    @_restartKeepAlive()
    if isPong(try JSON.parse event.data catch e then {})
      if @_lastMessageSequence?
        # don't callback to connectionVerified on subsequent reconnects
        @sendStartingMessageSequence @_lastMessageSequence
      else @config.webSocket.connectionVerified @

  sendStartingMessageSequence: (message_sequence) =>
    @_lastMessageSequence = message_sequence
    @socket.onmessage     = @_message
    @socket.send JSON.stringify {message_sequence}
    @_needToNotifyOfDisconnect = true
    Firehose.Transport::_open.call @

  stop: =>
    @_cleanUp()

  _message: (event) =>
    frame = @config.parse event.data
    @_restartKeepAlive()
    unless isPong frame
      try
        @_lastMessageSequence = frame.last_sequence
        @config.message @config.parse frame.message
      catch e

  _close: (event) =>
    if event?.wasClean then @_cleanUp()
    else @_error event

  _error: (event) =>
    @_cleanUp()
    if @_needToNotifyOfDisconnect
      @_needToNotifyOfDisconnect = false
      @config.disconnected()
    if @_succeeded then @connect @_retryDelay
    else @config.failed @

  _cleanUp: =>
    @_clearKeepalive()
    if @socket?
      @socket.onopen    = null
      @socket.onclose   = null
      @socket.onerror   = null
      @socket.onmessage = null
      @socket.close()
      delete @socket

  _restartKeepAlive: =>
    doPing = =>
      sendPing @socket
      setNextKeepAlive()
    setNextKeepAlive = =>
      @keepaliveTimeout = setTimeout doPing, KEEPALIVE_PING_TIMEOUT
    @_clearKeepalive()
    setNextKeepAlive()

  _clearKeepalive: =>
    if @keepaliveTimeout?
      clearTimeout @keepaliveTimeout
      @keepaliveTimeout = null

sendPing = (socket) ->
  socket.send JSON.stringify ping: 'PING'

isPong = (o) ->
  o.pong is 'PONG'

class Firehose.Consumer
  constructor: (@config = {}) ->
    # Empty handler for messages.
    @config.message      ||= ->
    # Empty handler for error handling.
    @config.error        ||= ->
    # Empty handler for when we establish a connection.
    @config.connected    ||= ->
    # Empty handler for when we're disconnected.
    @config.disconnected ||= ->
    # The initial connection failed. This is probably triggered when a
    # transport, like WebSockets is supported by the browser, but for whatever
    # reason it can't connect (probably a firewall)
    @config.failed       ||= ->
      throw "Could not connect"
    # Params that we'll tack on to the URL.
    @config.params       ||= {}
    # Do stuff before we send the message into config.message. The sensible
    # default on the webs is to parse JSON.
    @config.parse        ||= JSON.parse
    # Make sure we return ourself out of the constructor so we can chain.
    this

  connect: (delay=0) =>
    @config.connectionVerified = @_upgradeTransport
    if Firehose.WebSocket.supported()
      @upgradeTimeout = setTimeout =>
        ws = new Firehose.WebSocket @config
        ws.connect delay
      , 500
    @transport = new Firehose.LongPoll @config
    @transport.connect delay
    return

  stop: =>
    if @upgradeTimeout?
      clearTimeout @upgradeTimeout
      @upgradeTimeout = null
    @transport.stop()
    return

  _upgradeTransport: (ws) =>
    @transport.stop()
    ws.sendStartingMessageSequence @transport.getLastMessageSequence()
    @transport = ws
    return
