class CreateBuses < ActiveRecord::Migration
  def self.up
    create_table :buses do |t|
      t.column :company, :string
      t.column :vehicle_type, :string
      t.column :bus_stop_downtown, :string
      t.column :route_length_km, :decimal, :precision => 5, :scale =>5
      t.column :routes_taken, :string
      t.timestamps :default => Time.now
    end
  end

  def self.down
    drop_table :buses
  end
end

