class CreateListItems < ActiveRecord::Migration
  def change
    create_table :list_items do |t|
      t.integer :index
      t.string :title
      t.belongs_to :list
      t.string :list_type

      t.timestamps
    end
  end
end
