class Streetrelation < ActiveRecord::Migration

  def self.up
    create_table :streetrelations, :id =>false do |t|
      t.column :maproad_id, :integer, :null => false
      t.column :maproad_related_id , :integer, :null=>false
      t.column :lat_start, :decimal, :precision =>15, :scale =>10
      t.column :long_start, :decimal, :precision =>15, :scale=>10
      t.column :lat_end, :decimal, :precision =>15, :scale=>10
      t.column :long_end, :decimal, :precision=>15, :scale=>10
      t.column :distance_meters, :decimal, :precision=>15, :scale=>10

    end
      # Indexes are important for performance if join tables grow big
      add_index :streetrelations, [:maproad_id, :maproad_related_id], :unique=>true
      add_index :streetrelations, :maproad_related_id, :unique => false
  end

  def self.down
    drop_table :streetrelations
  end
end

