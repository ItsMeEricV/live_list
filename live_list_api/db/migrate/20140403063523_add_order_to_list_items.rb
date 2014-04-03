class AddOrderToListItems < ActiveRecord::Migration
  def change
    add_column :list_items, :order, :integer
  end
end
