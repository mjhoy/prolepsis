class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :title
      t.string :thought
      t.integer :project_id
      t.integer :position

      t.timestamps
    end

    add_index :entries, :project_id
  end
end
