# ruby that will get installed and set to `rvm use default`.
default['rvm']['default_ruby']      = "2.0.0@cue"
default['rvm']['user_default_ruby'] = "2.0.0@cue"

# list of additional rubies that will be installed
default['rvm']['rubies']      = ["ruby-1.9.3-p327"]