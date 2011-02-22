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
  def self.get_closest_points(lat_start,long_start,num_nodes)
    lon1,lon2,lat1,lat2 = self.get_coordinates(lat_start,long_start)                          
    @init_point = self.query_closest_points(lat_start,long_start,lon1,lat1,lon2,lat2,num_nodes)
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
  def self.query_closest_points(lat_start,long_start,lon1,lat1,lon2,lat2,num_nodes)
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
       limit " + num_nodes.to_s
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
      
        bearing = self.getBearing(route.lat_start,route.long_start,route.lat_end,route.long_end)
        direction = self.getDirection(bearing)
        
        infoNodes.push({:id            => route.id,
                        :lat_start     => route.lat_start,
                        :long_start    => route.long_start,
                        :lat_end       => route.lat_end,
                        :long_end      => route.long_end,
                        :stretch_type  => route.stretch_type,
                        :way_type_a    => route.way_type_a,
                        :street_name_a => route.street_name_a,
                        :prefix_a      => route.prefix_a,
                        :label_a       => route.label_a,
                        :common_name_a => route.common_name_a,
                        :distance      => sprintf('%.2f',route.distance_meters),
                        :way_type_b    => route.way_type_b,
                        :street_name_b => route.street_name_b,
                        :prefix_b      => route.prefix_b,
                        :label_b       => route.label_b,
                        :common_name_b => route.common_name_b,
                        :bearing       => bearing,
                        :direction     => direction,
                        :new_direction => direction
                        })
      end
    end
  
    infoNodes = reAssingDirection(infoNodes)
    infoNodes
  end
  
  #Computes how many degrees are between 2 pairs lat-long
  def self.getBearing(lat_start,long_start,lat_end,long_end)
    
    lat1  = lat_start*TO_RAD
    long1 = long_start*TO_RAD
    lat2  = lat_end*TO_RAD
    long2 = long_end*TO_RAD
    
    y = (Math.cos(lat1)*Math.sin(lat2))-( Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1))
    x = Math.sin(long2-long1)*Math.cos(lat2)
    brng = Math.atan2(x,y)%(2*Math::PI)
    brng = brng*(180/Math::PI)
    #bearing must be positive
    if(brng < 0 ) 
      brng = brng + 360
    end
    brng
  end
    
  
  #It gets the direction given the bearing in degrees
  def self.getDirection(bearing)
    direction = nil
    
    if( (bearing >= 0 && bearing <= 22.5) || (bearing>337.5 && bearing<360))
      direction = "Norte"
    elsif (bearing > 22.5  && bearing <= 67.5  ) 
      direction = "Nororiente"
    elsif (bearing > 67.5  && bearing <= 112.5 ) 
      direction = "Oriente"
    elsif (bearing > 112.5 && bearing <= 157.5 ) 
      direction = "Suroriente"
    elsif (bearing > 157.5 && bearing <= 202.5 ) 
      direction = "Sur"
    elsif (bearing > 202.5 && bearing <= 247.5 ) 
      direction = "Suroccidente"
    elsif (bearing > 247.5 && bearing <= 292.5 ) 
      direction = "Occidente"
    elsif (bearing > 292.5 && bearing <= 337.5 ) 
      direction = "Noroccidente"
    end
    
    direction   
  end

  #It compares the degrees that are between a record and another.
  #I do this because if the (i-1) index has 22.5 degrees and the (i) has 22 degrees
  #then when the app explains to the user where to turn it tells: 'turn in (that direction)'
  #when actually it has to tell 'go straight'. I take a base value of +- 15 degrees 
  def self.getNewDirection(prev_dir, curr_dir, prev_bearing, curr_bearing)
    bearing_dif, new_direction = nil
    
    bearing_dif = curr_bearing - prev_bearing;
    #Case when the current is greater than the previous
    if (bearing_dif>0 && bearing_dif<=15) && (curr_dir != prev_dir)
      new_direction = prev_dir
    #Case when the current is less than the previous  
    elsif (bearing_dif<0 && bearing_dif>=-15) && (curr_dir != prev_dir)
      new_direction = prev_dir       
    else
      new_direction = curr_dir
    end
    return new_direction   
  end
  
  def self.reAssingDirection(infoNodes)
    prev_bearing, curr_bearing, prev_dir, curr_dir = nil
    
    for i in 1 ... infoNodes.length-1 
       prev_dir = infoNodes[i-1][:new_direction]
       prev_bearing = infoNodes[i-1][:bearing]
       curr_bearing = infoNodes[i][:bearing]
       curr_dir = self.getNewDirection(prev_dir, infoNodes[i][:direction], prev_bearing, curr_bearing)
       infoNodes[i][:new_direction] = curr_dir
    end
   
   return infoNodes 
      
  end

end
