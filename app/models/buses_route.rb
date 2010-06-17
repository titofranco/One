class BusesRoute < ActiveRecord::Base

 def self.getOneBus
    resultado=Array.new
    sql = "Select br.id,br.bus_id,br.lat_start,br.long_start from buses_routes br"
    @buses = find_by_sql(sql)

    for bus in @buses
      resultado.push(:id=>bus.id,
                     :bus_id=>bus.bus_id,
                     :lat_start=>bus.lat_start,
                     :long_start=>bus.long_start)
    end
    resultado
 end
end

