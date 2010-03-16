class CreateBusesRoutes < ActiveRecord::Migration
  def self.up
    create_table :buses_routes do |t|
      t.column :roadmap_id, :integer, :null => false
      t.column :roadmap_related_id, :integer, :null => false
      t.column :bus_id, :integer, :null => false
    end

  end



  def self.down
    drop_table :buses_routes
  end
end

