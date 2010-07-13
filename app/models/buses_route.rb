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

def self.get_common_bus(bus_id_A, bus_id_B)

  sql = "Select distinct br.bus_id as bus_id_A, br2.bus_id as bus_id_B
        from buses_routes br
        inner join buses_routes br2
        On (br.roadmap_id = br2.roadmap_id)
        where br.bus_id in (" + bus_id_A.to_s + ") and br2.bus_id in (" + bus_id_B + ")" +
        " having bus_id_A <> bus_id_B "
  r = find_by_sql(sql)
end

end

