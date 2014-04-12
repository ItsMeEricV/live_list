class ListItem

  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :list

  field :title, type: String
  field :index, type: Integer
  field :order, type: Integer
  field :list_type, type: String
  field :action_id, type: String

end
