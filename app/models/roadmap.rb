class Roadmap < ActiveRecord::Base

  def initialize
    @init_point
    @end_point
  end

  def self.get_closest_init_point(lat_start,long_start)
    nodo = self.get_closest_points(lat_start,long_start,1)
    nodo
  end

  #Ambos queries tienen un radio equivalente a 500 metros equivalente a 0.310685596 millas
=begin
  def self.get_closest_points(lat_start,long_start,numNodos)
    sql = "select id, dest.lat_start,dest.long_start,3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start+
          "-abs(dest.lat_start)) * pi()/180 / 2), 2) +  COS("+lat_start+" * pi()/180 ) *
          COS(abs(dest.lat_start) * pi()/180) * POWER(SIN(("+long_start+ "- dest.long_start) *
          pi()/180 / 2), 2) )) as  distance
          FROM roadmaps dest
          where stretch_type = '1' and has_relation='S'
          having distance < 0.310685596
          order by distance limit "+numNodos.to_s
    @init_point = find_by_sql(sql)
    @init_point
  end
=end

def self.get_closest_points (lat_start,long_start,numNodos)
  dist = 0.310685596
  to_rad=(Math::PI/180)
  lon1 = long_start.to_f - dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
  lon2 = long_start.to_f + dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
  lat1 = lat_start.to_f - (dist/69)
  lat2 = lat_start.to_f + (dist/69)
  sql  ="select id, dest.lat_start,dest.long_start,
        3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start+" - dest.lat_start) * pi()/180 / 2), 2) +
        COS("+lat_start+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
        POWER(SIN(("+long_start+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
        FROM roadmaps dest
        where stretch_type = '1' and has_relation='S'
        and dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
        " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
        " order by distance limit "+numNodos.to_s
  @init_point = find_by_sql(sql)
  @init_point
end

=begin
  #Ambos queries tienen un radio equivalente a 500 metros equivalente a 0.310685596 millas
  def self.get_closest_end_point(lat_end,long_end)
    sql = "select id,lat_start,long_start,3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_end+ "-abs(dest.lat_start)) *
          pi()/180 / 2), 2) +  COS("+lat_end+" * pi()/180 ) *
          COS(abs(dest.lat_start) * pi()/180) * POWER(SIN(("+long_end+ "- dest.long_start) *
          pi()/180 / 2), 2) )) as  distance
          FROM roadmaps dest
          where dest.lat_start not in("+@init_point[0].lat_start.to_s+") and dest.long_start not in ("+@init_point[0].long_start.to_s+")
          and stretch_type = '1' and has_relation='S'
          having distance < 0.310685596
          order by distance limit 1"
    @end_point = find_by_sql(sql)
    @end_point
  end
=end

def self.get_closest_end_point(lat_end,long_end)
  dist = 0.310685596
  to_rad=(Math::PI/180)
  lon1 = long_end.to_f - dist/(Math.cos(to_rad*lat_end.to_f)*69).abs
  lon2 = long_end.to_f + dist/(Math.cos(to_rad*lat_end.to_f)*69).abs
  lat1 = lat_end.to_f - (dist/69)
  lat2 = lat_end.to_f + (dist/69)
  sql  ="select id, dest.lat_start,dest.long_start,
        3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_end+" - dest.lat_start) * pi()/180 / 2), 2) +
        COS("+lat_end+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
        POWER(SIN(("+long_end+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
        FROM roadmaps dest
        where stretch_type = '1' and has_relation='S'
        and dest.lat_start not in("+@init_point[0].lat_start.to_s+") and dest.long_start not in ("+@init_point[0].long_start.to_s+")
        and dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
        " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
        " order by distance limit 1"
    @end_point = find_by_sql(sql)
    @end_point
end

=begin
  def self.get_closest_point_by_id(roadmapId)
    sql = "select id, dest.lat_start,dest.long_start,3956 * 2 *
          ASIN(SQRT(POWER(SIN((temp.lat_start-abs(dest.lat_start))
          * pi()/180 / 2), 2) + COS(temp.lat_start * pi()/180 ) *
          COS(abs(dest.lat_start) * pi()/180) * POWER(SIN((temp.long_start- dest.long_start) *
          pi()/180 / 2), 2) )) as distance
          FROM roadmaps dest, (select lat_start,long_start from roadmaps where id="+roadmapId.to_s+")temp
          where stretch_type = '1' and has_relation='S'
          having distance < 0.310685596
          order by distance limit 20;"
    find_by_sql(sql)
  end
=end


  def self.get_closest_point_by_id(roadmapId)
    r = Roadmap.find(roadmapId.to_i,:select=>"lat_start,long_start");
    lat_start = r.lat_start
    long_start = r.long_start
    dist = 0.310685596
    to_rad=(Math::PI/180)
    lon1 = long_start.to_f - dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
    lon2 = long_start.to_f + dist/(Math.cos(to_rad*lat_start.to_f)*69).abs
    lat1 = lat_start.to_f - (dist/69)
    lat2 = lat_start.to_f + (dist/69)
    sql  ="select id, dest.lat_start,dest.long_start,
          3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start.to_s+" - dest.lat_start) * pi()/180 / 2), 2) +
          COS("+lat_start.to_s+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
          POWER(SIN(("+long_start.to_s+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
          FROM roadmaps dest
          where stretch_type = '1' and has_relation='S'
          and dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
          " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
          " order by distance limit 20"
    find_by_sql(sql)
  end

  #Obtiene todos los datos de la ruta devuelta por Dijkstra
  def self.getRoute(nodes,lat_start,long_start,lat_end,long_end)
    infoNodes = Array.new

    for i in 0 ...nodes.length-1
      route = StreetRelation.find_by_sql ["Select s.id,s.lat_start,s.long_start,s.lat_end,s.long_end,s.stretch_type, "+
                                         "a.way_type as way_type_a,a.street_name as street_name_a, "+
                                         "a.prefix as prefix_a,a.label as label_a,a.common_name as common_name_a,s.distance_meters, "+
                                         "b.way_type as way_type_b,b.street_name as street_name_b, "+
                                         "b.prefix as prefix_b,b.label as label_b, b.common_name as common_name_b "+
                                         "from street_relations s "+
                                         "inner join roadmaps as a "+
                                         "on(a.id = s.roadmap_id) "+
                                         "inner join roadmaps as b "+
                                         "on(b.id = s.roadmap_related_id) "+
                                         "where roadmap_id = ? AND roadmap_related_id = ?",nodes[i],nodes[i+1]]

      route = route[0]
      if(route.distance_meters >0  || (route.distance_meters == 0 && route.stretch_type != 1))
        infoNodes.push({:id=>route.id,
                        :lat_start=>route.lat_start,
                        :long_start=>route.long_start,
                        :lat_end=>route.lat_end,
                        :long_end=>route.long_end,
                        :stretch_type=>route.stretch_type,
                        :way_type_a=>route.way_type_a,
                        :street_name_a=>route.street_name_a,
                        :prefix_a=>route.prefix_a,
                        :label_a=>route.label_a,
                        :common_name_a=>route.common_name_a,
                        :distance=>route.distance_meters,
                        :way_type_b=>route.way_type_b,
                        :street_name_b=>route.street_name_b,
                        :prefix_b=>route.prefix_b,
                        :label_b=>route.label_b,
                        :common_name_b=>route.common_name_b
                        })
      end
    end
    infoNodes
  end
end

