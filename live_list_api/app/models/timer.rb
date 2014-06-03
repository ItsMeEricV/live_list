class Timer
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :list

  field :state, type: String
  field :start_time, type: Datetime
  field :duration, type: Time
end
