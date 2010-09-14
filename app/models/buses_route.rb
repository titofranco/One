class BusesRoute < ActiveRecord::Base

  #Obtiene todos las rutas de buses
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

  #Dado un conjunto de buses, examina si estos tienen una conexion directa por un roadmap_id
  def self.get_common_bus(bus_id_A, bus_id_B)

    sql = "Select distinct br.bus_id AS bus_id_A, br2.bus_id AS bus_id_B
          from buses_routes br
          inner join buses_routes br2
          On (br.roadmap_id = br2.roadmap_id)
          where br.bus_id in (" + bus_id_A.to_s + ") and br2.bus_id in (" + bus_id_B + ")" +
          " having br.bus_id <> br2.bus_id "
    r = find_by_sql(sql)
  end

  #Dado un id de la tabla buses_routes, dos conjuntos de buses, mira si hay conexion entre estos a una distancia determinada
  def self.get_closest_common_bus(id_table,bus_id_A,bus_id_B)
    result = Array.new
    busRoute = find(:all,:conditions => ["id >= ? and bus_id = ? ",id_table,bus_id_A])

    for record in busRoute
      lat_start = record.lat_start
      long_start = record.long_start
      dist = 0.310685596
      to_rad=(Math::PI/180)
      lon1 = long_start.to_f - dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
      lon2 = long_start.to_f + dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
      lat1 = lat_start.to_f - (dist/69)
      lat2 = lat_start.to_f + (dist/69)
#MYSQL      
=begin      
      sql  = "Select distinct "+bus_id_A.to_s+" as bus_A, temp.bus_id as bus_B
            FROM(select bus_id,roadmap_id, dest.lat_start,dest.long_start,
            3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start.to_s+" - dest.lat_start) * pi()/180 / 2), 2) +
            COS("+lat_start.to_s+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
            POWER(SIN(("+long_start.to_s+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
            FROM buses_routes dest
            where dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
            " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
            " and dest.bus_id in ("+ bus_id_B +") having distance < "+dist.to_s+ " order by distance limit 10) temp"
=end

#POSTGRESQL
      sql  = "Select distinct "+bus_id_A.to_s+" as bus_A, temp.bus_id as bus_B
            FROM(            
            select bus_id,roadmap_id, dest.lat_start,dest.long_start,
            3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start.to_s+" - dest.lat_start) * pi()/180 / 2), 2) +
            COS("+lat_start.to_s+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
            POWER(SIN(("+long_start.to_s+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
            FROM buses_routes dest 
            where dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
            " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
            " and dest.bus_id in ("+ bus_id_B +") ) temp
            where distance < "+dist.to_s+ " order by distance limit 10 "            
            
      r = find_by_sql(sql)

      for reg in r
        result.push(:bus_A => reg.bus_A, :bus_B => reg.bus_B)
      end
    end
=begin
    puts "antes del unique #{result.join(",")}"
    result = result.uniq
    for a in result
      puts "los valores del hash #{a[:bus_A]} #{a[:bus_B]}"
    end
=end
    return result.uniq
  end

  def self.get_closest_bus_id(roadmapId)
    result = Array.new
    r = Roadmap.find(roadmapId.to_i,:select=>"lat_start,long_start");
    lat_start = r.lat_start
    long_start = r.long_start
    dist = 0.310685596
    to_rad=(Math::PI/180)
    lon1 = long_start.to_f - dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
    lon2 = long_start.to_f + dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
    lat1 = lat_start.to_f - (dist/69)
    lat2 = lat_start.to_f + (dist/69)

#MYSQL
=begin    
    sql  ="SELECT bus_id, min(id) as busRouteId,min(distance) as distance
          FROM(
          Select id,bus_id,roadmap_id, dest.lat_start,dest.long_start,
          3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start.to_s+" - dest.lat_start) * pi()/180 / 2), 2) +
          COS("+lat_start.to_s+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
          POWER(SIN(("+long_start.to_s+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
          FROM buses_routes dest
          where dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
          " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
          " HAVING distance < "+dist.to_s+ " order by distance  limit 20) TEMP     
          GROUP BY 1"
=end
#POSTGRESQL          
    sql  ="SELECT bus_id, min(id) as busRouteId,min(distance) as distance
          FROM(
            SELECT * FROM (
            Select id,bus_id,roadmap_id, dest.lat_start,dest.long_start,
            3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start.to_s+" - dest.lat_start) * pi()/180 / 2), 2) +
            COS("+lat_start.to_s+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
            POWER(SIN(("+long_start.to_s+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
            FROM buses_routes dest
            where dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
            " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
            ") AS dest 
             WHERE distance < "+dist.to_s+ " order by distance  limit 20
          ) TEMP     
          GROUP BY 1"         
                    
    r = find_by_sql(sql)
    if r
      for reg in r
        result.push(:bus_id => reg.bus_id , :busRouteId => reg.busRouteId)
      end
    end
  end

end

