class Roadmap < ActiveRecord::Base
  
  DIST = 0.310685596 #Equivalent to 500 meters
  TO_RAD = (Math::PI/180) #Queries need coordinates given in radians
  
  def initialize
    @init_point
    @end_point
  end
  
  #Get variables used in all queries
  def self.get_coordinates(lat_start,long_start)
    lon1 = long_start.to_f - DIST/(Math.cos(TO_RAD*lat_start.to_f)*69).abs
    lon2 = long_start.to_f + DIST/(Math.cos(TO_RAD*lat_start.to_f)*69).abs
    lat1 = lat_start.to_f - (DIST/69)
    lat2 = lat_start.to_f + (DIST/69)
    return [lon1,lon2,lat1,lat2]  
  end
  
  #Get the closest points given lat_start, long_start, num_nodes
  def self.get_closest_points(lat_start,long_start)
    lon1,lon2,lat1,lat2 = self.get_coordinates(lat_start,long_start)                          
    init_point =
      self.query_closest_points(lat_start,long_start,lon1,lat1,lon2,lat2)
    init_point.first
  end
 
  #Query when you need to lat_start , long_start given the roadmap_id 
  def self.get_closest_point_by_id(roadmapId)
    r = Roadmap.find(roadmapId.to_i,:select=>"lat_start,long_start");
    lat_start = r.lat_start
    long_start = r.long_start
    lon1,lon2,lat1,lat2 = self.get_coordinates(lat_start,long_start)
    result = self.query_closest_points(lat_start,long_start,lon1,lat1,lon2,lat2,20)
  end
  
  #Standar query to get the closest points
  def self.query_closest_points(lat_start,long_start,lon1,lat1,lon2,lat2)
    #POSTGRESQL  
    sql  = "SELECT * FROM 
      (select id, dest.lat_start,dest.long_start,
      3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start.to_s+" - dest.lat_start) * pi()/180 / 2), 2) +
      COS("+lat_start.to_s+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
      POWER(SIN(("+long_start.to_s+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
      FROM roadmaps dest
      where stretch_type = '1' and has_relation='S'
      and dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
      " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
      ") AS dest
       WHERE distance < "+DIST.to_s+
      "order by distance 
       limit 1"
    query = find_by_sql(sql)      
  end

  #Get the closest node given the end point and not including the node closest to the initial point
  def self.get_closest_end_point(lat_end,long_end)
    lon1,lon2,lat1,lat2 = self.get_coordinates(lat_end,long_end)
    #POSTGRESQL        
    sql  ="SELECT * FROM 
        (select id, dest.lat_start,dest.long_start,
        3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_end+" - dest.lat_start) * pi()/180 / 2), 2) +
        COS("+lat_end+"* pi()/180 ) * COS (dest.lat_start * pi()/180) *
        POWER(SIN(("+long_end+ "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
        FROM roadmaps dest
        where stretch_type = '1' and has_relation='S'
        and dest.lat_start not in("+@init_point[0].lat_start.to_s+") and dest.long_start not in ("+@init_point[0].long_start.to_s+")
        and dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
        " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s + 
        ") AS dest
        WHERE distance < "+DIST.to_s+
        " order by distance limit 1"        
        
    @end_point = find_by_sql(sql)
    @end_point
  end

  #Get all the data from Dijkstra algorithm result
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
