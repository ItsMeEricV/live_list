class Timer
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :list

  field :state, type: String
  field :current_timecode, type: String
end
