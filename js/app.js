// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'marionette',
  'myapp',
  'router',
  'vent',
  'views/home/HomeView'
], function($, _, Backbone, Marionette, app, AppRouter, vent, HomeView){

  var that = this;


  var BrowserDetect = 
  {
      init: function () 
      {
          this.browser = this.searchString(this.dataBrowser) || "Other";
          this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
      },

      searchString: function (data) 
      {
          for (var i=0 ; i < data.length ; i++)   
          {
              var dataString = data[i].string;
              this.versionSearchString = data[i].subString;

              if (dataString.indexOf(data[i].subString) != -1)
              {
                  return data[i].identity;
              }
          }
      },

      searchVersion: function (dataString) 
      {
          var index = dataString.indexOf(this.versionSearchString);
          if (index == -1) return;
          return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
      },

      dataBrowser: 
      [
          { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
          { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
          { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
          { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
          { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
      ]

  };
  BrowserDetect.init();

  app.BrowserDetect = BrowserDetect;




  app.on("initialize:before", function(){

    //if Backbone history has not already been start it then start it
    if(!Backbone.history.started) {
      Backbone.history.start({pushState: true});
    }

    $(document).on('click', 'a:not([data-bypass])', function (evt) {

      var href = $(this).attr('href');
      var protocol = this.protocol + '//';

      if (href.slice(protocol.length) !== protocol) {
        evt.preventDefault();
        app_router.navigate(href, true);
      }
    });


  //DEFINE ROUTES
  var app_router = new AppRouter;

    


  app_router.on('route:defaultAction', function (actions,params) {


    // We have no matching route, lets display the home page and home navbar
    var homeView = new HomeView(params);
    app.content.show(homeView);


  });


  /*******************************************/
  //Extra helper functions. Should go in an external file someday

      //prefilter all Ajax requests with the API prefix
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        
        //options.url = '/api/v1' + options.url;
        
      });


      $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
        });
        return o;
      };


      $.fn.animateRotate = function(startAngle, endAngle, duration, easing, complete){
          return this.each(function(){
              var elem = $(this);

              $({deg: startAngle}).animate({deg: endAngle}, {
                  duration: duration,
                  easing: easing,
                  step: function(now){
                      elem.css({
                        '-moz-transform':'rotate('+now+'deg)',
                        '-webkit-transform':'rotate('+now+'deg)',
                        '-o-transform':'rotate('+now+'deg)',
                        '-ms-transform':'rotate('+now+'deg)',
                        'transform':'rotate('+now+'deg)'
                      });
                  },
                  complete: complete || $.noop
              });
          });
      };



  /******************************************/





  //start the app. 
  //TODO This should be in main.js as "App.start()" but it's not working and returns an error.
  app.start();

});
