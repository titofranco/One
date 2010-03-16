class CreateRoadmaps < ActiveRecord::Migration
  def self.up
    create_table :roadmaps do |t|
      t.column :way_type, :string, :limit => 13
      t.column :street_name, :string, :limit =>50
      t.column :common_name, :string, :limit =>50
      t.column :municipality, :string, :limit=>20
      t.column :prefix, :string, :limit=>2
      t.column :label, :string, :limit =>20
      t.column :shape_length,:decimal, :precision =>15, :scale =>10
      t.column :lat_start,:decimal, :precision =>15, :scale =>10, :null => false
      t.column :lat_center,:decimal, :precision =>15, :scale =>10
      t.column :lat_end, :decimal, :precision =>15, :scale =>10, :null => false
      t.column :long_start, :decimal, :precision =>15, :scale =>10, :null => false
      t.column :long_center,:decimal, :precision =>15, :scale =>10
      t.column :long_end,:decimal, :precision =>15, :scale =>10, :null => false
      t.column :stretch_type, :integer, :null => false
      t.column :speed_km_h, :decimal, :precision =>15, :scale =>10
      t.timestamps
    end

    add_index :roadmaps, :lat_start
    add_index :roadmaps, :lat_end
    add_index :roadmaps, :long_start
    add_index :roadmaps, :long_end

  end

  def self.down
    drop_table :roadmaps
  end
end

