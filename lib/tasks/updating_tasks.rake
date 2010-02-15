

task :calculate_distance => :environment do

street = Streetrelation.new

(Streetrelation.find :all).each do |record|

  distance = street.distanceHarvesine(record.lat_start,record.long_start,record.lat_end,record.long_end)
  record.update_attribute(:distance_meters,distance)
 # puts "start: #{record.lat_start},#{record.long_start}  end: #{record.lat_end},#{record.long_end} distance: #{distance}"

end

end

