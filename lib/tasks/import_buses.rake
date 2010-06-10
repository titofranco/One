require 'csv'

task :import_buses => :environment do
  begin
    csv = CSV.open "#{RAILS_ROOT}/lib/Text_Files/rutas_buses.csv","r"
    csv.each_with_index do |row,i|
      id,lat,long = row
      r = Roadmap.find(:all,:select=>"id",:conditions =>["lat_start = ? and long_start  =  ? and has_relation = 'S'",lat,long])
      f = r.collect { |a| a["id"]}
      b = BusesRoute.new(
                         :roadmap_id => f,
                          :lat_start => lat,
                          :long_start => long,
                          :bus_id => id
                          )
puts  b.inspect
  puts r.to_s
  b.save
    end
  end
end
