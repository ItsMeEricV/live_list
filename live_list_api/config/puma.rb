#!/usr/bin/env puma

port        ENV['PORT']     || 3000

environment ENV['RACK_ENV'] || 'development'

daemonize false

pidfile 'tmp/pids/puma.pid'
state_path 'tmp/pids/puma.state'

# quiet
threads 0, 16
#bind 'unix:///home/vagrant/live_list.sock'