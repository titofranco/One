class MapController < ApplicationController


def initialize
  @a = Array.new
  #@a=["1","2","5466","5479","4","5524","5563","5616","5617","13","5660","14","5722","5702","5776","20","5843","21","5825","5874","5904","30","5932","5950","5984","5997","6046","6091","6148","6183","6222","6251","6276","6308","6325","6353","6347","52","53","6403","6422","56","6443","57","6464","60","6499","6517","6536","6537","6650","6704","6757","6793","6847","73","6887","6927","6896","6854","6872","6933","6903","6878","6945","6997","78","7017","7062","80","82","7147","7148","7141","7121","7135","7085","7107","7129","7130","7157","7211","7233","7251","7252","7260","7271","7290","7322","7382","7380","7462","7490","7581","7667","100","7969","7997","7970","7955","8078","114","8134","8128","8181","8192","8240","122","124","130","133","138","144","150","154","170","180","195","215","244","263","279","294","316","9357","9288","9261","9242","9225","9203","265","280","9364","340","9463","9572","9660","9691","9762","9782","9830","9856","9857","9915","9940","9961","484","496","509","519","528","10220","10308","10331","10379","10384","10422","10451","10561","10622","10675","10694","10695","10762","10812","10890","10961","11054","11613","11681","11682","11770","958","966","11978","12062","12208","12340","12494","12558","1092","1159","13057","13043","13064","1144","1265","1304","14346","14700","14875","15004","15092","1461","1474","1540","1608","15856","15862","15873","15889","1667","1678","1699","16093","1716","1730","1780","1829","16818","1907","1942","1975","17505","17560","17500","17501","2159","2141","2130","2122","2123","2197","2264","2330","2360","18891","18979","19326","2495","2515","2553","2600","2628","2669","20536","2735","2747","2789","2810","2846","2900","21984","21961","21929","21930","22113","22088","22303","22533","22534","22499","22736","22706","22707","22860","22989","23114","23258","23365","23419","23568","23734","23850","23877","23941","24015","24122","24223","24346","24347","24332","24444","24752","24736","24874","24875","24853","24818","24783","24763","24742","24718","24665","3271","24899","24870","24836","3294","24813","24784","24762","24741","24709","24673","24654","24797","3310","24881","25194","25488","25724","25721","25711","25928","26003","26243","3448","26246","3468","26502","3489","26670","26644","26822","26823","3506","26924","26928","26909","3515","27080","27022","27196","3554","3562","27611","27661","27662","27840","28000","28394","28586","28678","28680","28803","28944","28988","29078","29022","28945","28915","28887","28886","28867","28787","28764","28851","28865","28860","28984","29054","29123","29255","29333","29429","3733","29510","29564","29591","29592","3757","3768","29766","3787","29928","3799","3808","30209","30361","30362","30656","30691","30722","30772","30774","30852","3878","30992","31027","31057","31023","30998","31011","31150","31173","31239","3925","31314","31433","31617","31671","31720","31901","31945","4001","4010","4014","32171","32511","32512","32598","32628","32679","32799","32933","33087","4153","33232","33239","33211","33327","33383","33386","33525","33635","33636","33686","33727","33838","33839","4242","33946","4249","34025","4270","34244","4298","34462","34539","34554","34560","34634","34695","34775","4373","34798","34809","4382","4386","34866","34889","34941","34965","34971","34981","34994","35017","35030","34951","4403","34953","34848","34893","34901","4375","4363","4341","34581","34629","4330","4315","34439","34338","34335","4294","34331","4280","34226","34142","34090","33823","33812","33738","33701","33705","4186","33314","33313","33631","33825","33979","34087","34187","34286","34422","34523","34644","34736","34945","35335","35457","35500","35556","35594","35646","35689","35742","35794","35861","35930","35973","36042","36116","36183","36255","36360","36444","36548","36606","36609","36655","36675","36694","36711","36728","36744","36753","36769","36782","36789","36802","36812","36822","36832","36843","36852","36858","36862","36869","36878","36899","36914","36947","36963","36981","36993","36996","37001","37012","37029","37034","37053","37072","37105","37126","37143","37162","37253","37304","37358","37359","37373","37353","37346","37354","37456","37570","37656","37698","37689","37672","37731","37813","37800","37799","37776","37761","37856","37892","4814","37945","37948","38037","38086","38143","38222","38280","38307","38378","38400","38426","38428","38477","38540","38558","38574","38675","38752","38753","38765","38787","38826","38879","38923","38924","5008","39005","39044","5050","39172","39174","39243","39362","39405","39497","39618","5206","5226","5234","5239","39823","39842","39889","39896","39897","39894","5253"]
  #@a= ["1","3","2","6","14","17","10","11","16","15","27","23","24","21","18","26","25","34"] #esta malo
  @a = ["1","3","6","14","18","21","24","27","23","28","25","34","36","48"]
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

  sql = "select id, dest.lat_start,dest.long_start,3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_start+
        "-abs(dest.lat_start)) * pi()/180 / 2), 2) +  COS("+lat_start+" * pi()/180 ) *
        COS(abs(dest.lat_start) * pi()/180) * POWER(SIN(("+long_start+ "- dest.long_start) *
        pi()/180 / 2), 2) )) as  distance
        FROM roadmaps dest
        having distance < 0.062137119
        order by distance limit 1"
  @init_point = Roadmap.find_by_sql(sql)

  if(@init_point.to_s =="")
    return "Debe elegir un punto inicial más ceracano"
  else
    sql = "select id,3956 * 2 * ASIN(SQRT(POWER(SIN((" +lat_end+ "-abs(dest.lat_start)) *
          pi()/180 / 2), 2) +  COS("+lat_end+" * pi()/180 ) *
          COS(abs(dest.lat_start) * pi()/180) * POWER(SIN(("+long_end+ "- dest.long_start) *
          pi()/180 / 2), 2) )) as  distance
          FROM roadmaps dest
          where dest.lat_start not in("+@init_point[0].lat_start.to_s+") and dest.long_start not in ("+@init_point[0].long_start.to_s+")
          having distance < 0.062137119
          order by distance limit 1"
    @end_point = Roadmap.find_by_sql(sql)
    if(@end_point.to_s=="")
      return "Debe elegir un punto final más cercano"
    end
  end

return "true"

end

def metodoruta(lat_start,long_start,lat_end,long_end)

  resultado = Array.new

  # Se debe hacer conexion con el punto inicial escogido por el usuario y el primer nodo en el grafo
  point_a = Roadmap.find(@init_point[0].id,:select=> "way_type,street_name,prefix,label,lat_start,long_start")
  resultado.push({:id=>00000,:lat_start=>lat_start, :long_start=>long_start,
  :lat_end=>point_a.lat_start,:long_end=>point_a.long_start,:stretch_type=>1,
  :way_type_a=>" ",:street_name_a=>" ",:prefix_a=>" ",
  :label_a=>" ",:way_type_b=>point_a.way_type,:street_name_b=>point_a.street_name,
  :prefix_b=>point_a.prefix,:label_b=>point_a.label})
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
                                       "a.prefix as prefix_a,a.label as label_a, "+
                                       "b.way_type as way_type_b,b.street_name as street_name_b, "+
                                       "b.prefix as prefix_b,b.label as label_b "+
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
    :label_a=>route.label_a,:way_type_b=>route.way_type_b,:street_name_b=>route.street_name_b,
    :prefix_b=>route.prefix_b,:label_b=>route.label_b })
    else
      puts "El registro para roadmap_id #{@a[i]} roadmap_related_id:#{@a[i+1]} no está en la BD"
    end
  end
 # puts "El ultimo registro es #{route.id} #{route.street_name_b}"

  #El ultimo registro en el array es el que va conectado con el punto final escogido por el usuario
  #last_point = Roadmap.find(@end_point[0].id,:select=> "way_type,street_name,prefix,label,lat_start,long_start")
  resultado.push({:id=>99999,:lat_start=>route.lat_end, :long_start=>route.long_end,
  :lat_end=>lat_end,:long_end=>long_end,:stretch_type=>1,
  :way_type_a=>route.way_type_b,:street_name_a=>route.street_name_b,:prefix_a=>route.prefix_b,
  :label_a=>route.label_a,:way_type_b=>" ",:street_name_b=>" ",
  :prefix_b=>" ",:label_b=>" "})
  resultado
end

end

