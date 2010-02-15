# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100202161644) do

  create_table "maproads", :force => true do |t|
    t.string  "way_type",     :limit => 10
    t.string  "street_name",  :limit => 50
    t.string  "common_name",  :limit => 50
    t.string  "municipality", :limit => 20
    t.string  "prefix",       :limit => 2
    t.integer "from_left"
    t.integer "to_left"
    t.integer "from_right"
    t.integer "to_right"
    t.string  "version",      :limit => 3
    t.string  "label",        :limit => 20
    t.decimal "shape_length",               :precision => 15, :scale => 10
    t.decimal "lat_start",                  :precision => 15, :scale => 10
    t.decimal "lat_center",                 :precision => 15, :scale => 10
    t.decimal "lat_end",                    :precision => 15, :scale => 10
    t.decimal "long_start",                 :precision => 15, :scale => 10
    t.decimal "long_center",                :precision => 15, :scale => 10
    t.decimal "long_end",                   :precision => 15, :scale => 10
  end

  add_index "maproads", ["lat_center"], :name => "index_maproads_on_lat_center"
  add_index "maproads", ["lat_end"], :name => "index_maproads_on_lat_end"
  add_index "maproads", ["lat_start"], :name => "index_maproads_on_lat_start"
  add_index "maproads", ["long_center"], :name => "index_maproads_on_long_center"
  add_index "maproads", ["long_end"], :name => "index_maproads_on_long_end"
  add_index "maproads", ["long_start"], :name => "index_maproads_on_long_start"

  create_table "streetrelations", :force => true do |t|
    t.integer "maproad_id",                                         :null => false
    t.integer "maproad_related_id",                                 :null => false
    t.decimal "lat_start",          :precision => 15, :scale => 10
    t.decimal "long_start",         :precision => 15, :scale => 10
    t.decimal "lat_end",            :precision => 15, :scale => 10
    t.decimal "long_end",           :precision => 15, :scale => 10
    t.decimal "distance_meters",    :precision => 15, :scale => 10
  end

  add_index "streetrelations", ["maproad_id", "maproad_related_id"], :name => "index_streetrelations_on_maproad_id_and_maproad_related_id", :unique => true
  add_index "streetrelations", ["maproad_related_id"], :name => "index_streetrelations_on_maproad_related_id"

end
