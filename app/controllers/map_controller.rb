class MapController < ApplicationController


def initialize
  @a = Array.new
#Toda la linea B del metro
#@a=["40026","40025","40024","40023","40022","40021","40020","40019","40018","40017","40016","40015","40014","40013","40012","40011","40010","40009","40008","40007","40006","40005","40004","40003","40002","40001","40000","39999","39998","39997","39996","39995","39994","39993","39992","39991","39990","39989","39988","39987","39986","39985","39984","39983","39982","39981","39980","39979","39978","39977","39976","39975","39974","39973","39972","39971","39970","39969","39968","39967","39966","39965","39964","39963","39962","39961","39960","39959","39958","39957","39956","39955","39954","39953","39952","39951","39950","39949","39948","39947","39946","39945","39944","39943","39942","39941","39940","39939","39938","39937","39936","39935","39934","39933","39932","39931","39930","39929","39928","39927","39926","39925","39924","39923","39922","39921","39920","39919","39918","39917","39916"]

#Una estación del metro
@a=["40026","40025","40024","40023","40022","40021","40020","40019","40018","40017","40016","40015","40014","40013","40012","40011","40010","40009","40008","40007","40006","40005","40004","40003","40002","40001","40000","39999","39998","39997","39996","18179", "18292"]

#Trayecto de prueba del metro
#@a=["40026","40025","40024","40023","40022","40021","40020","40019","39996","39995"]
#@a= ["1","3","2","6","14","17","10","11","16","15","27","23","24","21","18","26","25","34"] #esta malo
  #@a = ["1","3","6","14","18","21","24","27","23","28","25","34","36","48"]
  #@a = ["1","3","6","14","18","21","24","22","17","10","11","16","20","15","27","23","28","25","34","36","48"]
end

def calcular

  param_initial_point = params[:initial_point]
  param_end_point = params[:end_point]
  lat_start,long_start = param_initial_point.split(/,/)
  lat_end,long_end = param_end_point.split(/,/)
  eval_points = get_closest_points(lat_start,long_start,lat_end,long_end)
  if(eval_points.to_s.eql?("true"))
     resultadoquery = metodoruta(lat_start,long_start,lat_end,long_end)
     res={:success=>true, :content=>resultadoquery}
     render :text=>res.to_json
  else
    res={:success=>false, :content=>eval_points}
    render :text=>res.to_json
  end
end

def get_closest_points(lat_start,long_start,lat_end,long_end)
  #puts "el lat-long start #{lat_start},#{long_start} el lat-long_end #{lat_end},#{long_end} "
  #Ambos queries tienen un radio equivalente a 500 metros equivalente a 0.310685596 millas
  sql = "select id, dest.lat_start,dest.long_start,3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start+
        "-abs(dest.lat_start)) * pi()/180 / 2), 2) +  COS("+lat_start+" * pi()/180 ) *
        COS(abs(dest.lat_start) * pi()/180) * POWER(SIN(("+long_start+ "- dest.long_start) *
        pi()/180 / 2), 2) )) as  distance
        FROM roadmaps dest
        having distance < 0.310685596
        order by distance limit 1"
  @init_point = Roadmap.find_by_sql(sql)

  if(@init_point.empty?)
    return "Debe elegir un punto inicial más ceracano"
  else
    sql = "select id,3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_end+ "-abs(dest.lat_start)) *
          pi()/180 / 2), 2) +  COS("+lat_end+" * pi()/180 ) *
          COS(abs(dest.lat_start) * pi()/180) * POWER(SIN(("+long_end+ "- dest.long_start) *
          pi()/180 / 2), 2) )) as  distance
          FROM roadmaps dest
          where dest.lat_start not in("+@init_point[0].lat_start.to_s+") and dest.long_start not in ("+@init_point[0].long_start.to_s+")
          having distance < 0.310685596
          order by distance limit 1"
    @end_point = Roadmap.find_by_sql(sql)
    if(@end_point.empty?)
      return "Debe elegir un punto final más cercano"
    end
  end

return "true"

end

def metodoruta(lat_start,long_start,lat_end,long_end)

  resultado = Array.new

  # Se debe hacer conexion con el punto inicial escogido por el usuario y el primer nodo en el grafo
  point_a = Roadmap.find(@init_point[0].id,
                        :select=> "way_type,street_name,prefix,label,common_name,lat_start,long_start")
  resultado.push({:id=>00000,:lat_start=>lat_start, :long_start=>long_start,
  :lat_end=>point_a.lat_start,:long_end=>point_a.long_start,:stretch_type=>1,
  :way_type_a=>" ",:street_name_a=>" ",:prefix_a=>" ",:label_a=>" ",
  :common_name_a=>" ",:way_type_b=>point_a.way_type,:street_name_b=>point_a.street_name,
  :prefix_b=>point_a.prefix,:label_b=>point_a.label,:common_name_b=>point_a.common_name})
  #puts "El resultado del query para el punto mas cercano inicial #{init_point}"
#QuerY para pintar lineas del metro, cada una se debe pintar a parte mejor
=begin
  r = Roadmap.find(:all,:conditions => ['stretch_type in (?) AND municipality in (?)',[3],['MEDELLIN']])
    r.each do |s|
      resultado.push({:id=>s.id,
      :lat_start=>s.lat_start, :long_start=>s.long_start, :lat_end=>s.lat_end, :long_end=>s.long_end,
      :stretch_type=>s.stretch_type })
    end
=end
  for i in 0 ...@a.length-1
    if StreetRelation.exists?(:roadmap_id=>@a[i], :roadmap_related_id=>@a[i+1])
    route = StreetRelation.find_by_sql ["Select s.id,s.lat_start,s.long_start,s.lat_end,s.long_end,s.stretch_type, "+
                                       "a.way_type as way_type_a,a.street_name as street_name_a, "+
                                       "a.prefix as prefix_a,a.label as label_a,a.common_name as common_name_a, "+
                                       "b.way_type as way_type_b,b.street_name as street_name_b, "+
                                       "b.prefix as prefix_b,b.label as label_b, b.common_name as common_name_b "+
                                       "from street_relations s "+
                                       "inner join roadmaps as a "+
                                       "on(a.id = s.roadmap_id) "+
                                       "inner join roadmaps as b "+
                                       "on(b.id = s.roadmap_related_id) "+
                                       "where roadmap_id = ? AND roadmap_related_id = ?",@a[i],@a[i+1]]

    route = route[0]
    resultado.push({:id=>route.id,:lat_start=>route.lat_start, :long_start=>route.long_start,
    :lat_end=>route.lat_end,:long_end=>route.long_end,:stretch_type=>route.stretch_type,
    :way_type_a=>route.way_type_a,:street_name_a=>route.street_name_a,:prefix_a=>route.prefix_a,
    :label_a=>route.label_a,:common_name_a=>route.common_name_a,:way_type_b=>route.way_type_b,:street_name_b=>route.street_name_b,
    :prefix_b=>route.prefix_b,:label_b=>route.label_b,:common_name_b=>route.common_name_b})
    else
      puts "El registro para roadmap_id #{@a[i]} roadmap_related_id:#{@a[i+1]} no está en la BD"
    end
  end
 # puts "El ultimo registro es #{route.id} #{route.street_name_b}"

  #El ultimo registro en el array es el que va conectado con el punto final escogido por el usuario
  #last_point = Roadmap.find(@end_point[0].id,:select=> "way_type,street_name,prefix,label,lat_start,long_start")
  resultado.push({:id=>99999,:lat_start=>route.lat_end, :long_start=>route.long_end,
  :lat_end=>lat_end,:long_end=>long_end,:stretch_type=>1,:way_type_a=>route.way_type_b,
  :street_name_a=>route.street_name_b,:prefix_a=>route.prefix_b,:label_a=>route.label_a,
  :common_name_a=>route.common_name_a,:way_type_b=>" ",:street_name_b=>" ",:prefix_b=>" ",
  :label_b=>" ",:common_name_b=>" "})
  resultado
end

def calcularRuta
end

end

