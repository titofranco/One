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

  def self.getRoute(nodes,lat_start,long_start,lat_end,long_end)
    resultado = Array.new
    # Se debe hacer conexion con el punto inicial escogido por el usuario y el primer nodo en el grafo
=begin
    point_a = find(@init_point[0].id,
                          :select=> "way_type,street_name,prefix,label,common_name,lat_start,long_start")
    resultado.push({:id=>00000,:lat_start=>lat_start, :long_start=>long_start,
    :lat_end=>point_a.lat_start,:long_end=>point_a.long_start,:stretch_type=>1,
    :way_type_a=>" ",:street_name_a=>" ",:prefix_a=>" ",:label_a=>" ",
    :common_name_a=>" ",:distance=>1, :way_type_b=>point_a.way_type,:street_name_b=>point_a.street_name,
    :prefix_b=>point_a.prefix,:label_b=>point_a.label,:common_name_b=>point_a.common_name})
    #puts "El resultado del query para el punto mas cercano inicial #{init_point}"
    #QuerY para pintar lineas del metro, cada una se debe pintar a parte mejor
=end
=begin
      r = Roadmap.find(:all,:conditions => ['stretch_type in (?) AND municipality in (?)',[3],['MEDELLIN']])
        r.each do |s|
          resultado.push({:id=>s.id,
          :lat_start=>s.lat_start, :long_start=>s.long_start, :lat_end=>s.lat_end, :long_end=>s.long_end,
          :stretch_type=>s.stretch_type })
        end
=end
    for i in 0 ...nodes.length-1
      if StreetRelation.exists?(:roadmap_id=>nodes[i], :roadmap_related_id=>nodes[i+1])
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
      resultado.push({:id=>route.id,:lat_start=>route.lat_start, :long_start=>route.long_start,
      :lat_end=>route.lat_end,:long_end=>route.long_end,:stretch_type=>route.stretch_type,
      :way_type_a=>route.way_type_a,:street_name_a=>route.street_name_a,:prefix_a=>route.prefix_a,
      :label_a=>route.label_a,:common_name_a=>route.common_name_a,:distance=>route.distance_meters,:way_type_b=>route.way_type_b,
      :street_name_b=>route.street_name_b,:prefix_b=>route.prefix_b,:label_b=>route.label_b,:common_name_b=>route.common_name_b})
      end
      else
        puts "El registro para roadmap_id #{nodes[i]} roadmap_related_id:#{nodes[i+1]} no está en la BD"
      end
    end
   # puts "El ultimo registro es #{route.id} #{route.street_name_b}"

    #El ultimo registro en el array es el que va conectado con el punto final escogido por el usuario
    #last_point = Roadmap.find(@end_point[0].id,:select=> "way_type,street_name,prefix,label,lat_start,long_start")
=begin
    resultado.push({:id=>999999,:lat_start=>route.lat_end, :long_start=>route.long_end,
    :lat_end=>lat_end,:long_end=>long_end,:stretch_type=>1,:way_type_a=>route.way_type_b,
    :street_name_a=>route.street_name_b,:prefix_a=>route.prefix_b,:label_a=>route.label_a,
    :common_name_a=>route.common_name_a,:distance=>1,:way_type_b=>" ",:street_name_b=>" ",:prefix_b=>" ",
    :label_b=>" ",:common_name_b=>" "})
=end
    resultado
  end


end

