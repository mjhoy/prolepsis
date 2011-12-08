class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.string :permalink, :null => false
      t.integer :position

      t.timestamps
    end

    add_index :projects, :permalink, :unique => true
  end
end
