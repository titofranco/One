class CreateMaproads < ActiveRecord::Migration
  def self.up
    create_table :maproads do |t|
      t.column :way_type, :string, :limit => 10
      t.column :street_name, :string, :limit =>50
      t.column :common_name, :string, :limit =>50
      t.column :municipality, :string, :limit=>20
      t.column :prefix, :string, :limit=>2
      t.column :from_left, :integer
      t.column :to_left, :integer
      t.column :from_right, :integer
      t.column :to_right, :integer
      t.column :version, :string, :limit =>3
      t.column :label, :string, :limit =>20
      t.column :shape_length,:decimal, :precision =>15, :scale =>10
      t.column :lat_start,:decimal, :precision =>15, :scale =>10
      t.column :lat_center,:decimal, :precision =>15, :scale =>10
      t.column :lat_end, :decimal, :precision =>15, :scale =>10
      t.column :long_start, :decimal, :precision =>15, :scale =>10
      t.column :long_center,:decimal, :precision =>15, :scale =>10
      t.column :long_end,:decimal, :precision =>15, :scale =>10
    end

  add_index :maproads, :lat_start
  add_index :maproads, :lat_center
  add_index :maproads, :lat_end
  add_index :maproads, :long_start
  add_index :maproads, :long_center
  add_index :maproads, :long_end


  end



  def self.down
    drop_table :maproads
  end
end

