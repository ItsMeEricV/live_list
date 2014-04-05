class List
  include Mongoid::Document
  include Mongoid::Timestamps

  embeds_many :list_items, cascade_callbacks: true
  accepts_nested_attributes_for :list_items,
    allow_destroy: true

  field :title, type: String
end
