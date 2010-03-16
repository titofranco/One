class CreateStreetRelations < ActiveRecord::Migration
  def self.up
    create_table :street_relations do |t|
      t.column :roadmap_id, :integer, :null => false
      t.column :roadmap_related_id , :integer, :null=>false
      t.column :lat_start, :decimal, :precision =>15, :scale =>10, :null=>false
      t.column :long_start, :decimal, :precision =>15, :scale=>10, :null=>false
      t.column :lat_end, :decimal, :precision =>15, :scale=>10, :null=>false
      t.column :long_end, :decimal, :precision=>15, :scale=>10, :null=>false
      t.column :distance_meters, :decimal, :precision=>15, :scale=>10, :null=>false
      t.column :stretch_type, :integer, :null=>false
    end

      # Indexes are important for performance if join tables grow big
      add_index :street_relations, [:roadmap_id, :roadmap_related_id], :unique=>true
      add_index :street_relations, :roadmap_related_id, :unique => false

  end

  def self.down
    drop_table :street_relations
  end
end

