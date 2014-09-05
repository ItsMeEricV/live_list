class Timer
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :list

  #current state of the timer. Can be "stopped" or "started"
  field :state, type: String
  #last time when a stop/start action "event" was initiated
  field :action_time, type: Integer
  #duration since the last action event
  field :duration, type: Integer
end
