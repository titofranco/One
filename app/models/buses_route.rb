class BusesRoute < ActiveRecord::Base

 def self.getOneBus
    resultado=Array.new
    sql = "Select br.id,br.lat_start,br.long_start from buses_routes br"
    @bus = find_by_sql(sql)

    for reg in @bus
      resultado.push(:id=>reg.id,:lat_start=>reg.lat_start,:long_start=>reg.long_start)
    end
    resultado
 end

end

