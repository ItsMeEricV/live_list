class List
  include Mongoid::Document
  include Mongoid::Timestamps

  embeds_many :list_items, cascade_callbacks: true
  embeds_one :timer, cascade_callbacks: true

  accepts_nested_attributes_for :list_items,
    allow_destroy: true
  accepts_nested_attributes_for :timer,
    allow_destroy: true
  

  field :title, type: String
  field :active_list_item, type: String
end
