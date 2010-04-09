class StreetRelation < ActiveRecord::Base
  def self.getMatrix
    find(:all, :select=>"roadmap_id, roadmap_related_id,
  distance_meters,stretch_type,lat_start,long_start", :limit=>1000)
  end
end
