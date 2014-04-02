require 'firehose'
consumer = Firehose::Rack::Consumer.new do |app|
  app.http_long_poll.timeout = 20
end

run consumer