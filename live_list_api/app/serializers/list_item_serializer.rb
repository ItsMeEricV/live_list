class ListItemSerializer < ActiveModel::Serializer
  attributes :id,:title, :created_at, :updated_at, :index, :order, :list_type

  def id
    object.id.to_s
  end

end
