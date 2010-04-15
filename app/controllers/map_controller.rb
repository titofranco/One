class MapController < ApplicationController


def initialize
  @a = Array.new
  @a= ["4","5524","5563","5616","5648","5679","5716","5715","5672","5639","5651","5718","5734","5751","5841","5832","5851","5872","5873","5907","5950","5985","6018","5995","6065","6091","6148","6183","6369","6388","6439","6440","6551","6575","6621","6696","6763","6854","6896","6927","6928","6961","6975","7006","7034","7094","7152","7154","7245","7193","7192","7100","7108","7160","7161","7210","7240","7261","7332","7337","7355","7363","7374","7383","7395","7414","7433","7447","7463","7471","7479","7486","7494","7499","7514","7526","7538","7553","7580","7765","8037","8053","8059","8063","8069","8082","8090","8099","8109","8115","8127","8137","8144","8153","8160","8169","8175","8180","8187","8244","8264","8289","8314","8404","8418","8429","8443","8450","8467","8479","8494","8501","8519","8528","8536","8544","8552","8564","8574","8581","8606","8639","8767","8768","8840","8817","8962","9077","9098","9121","9157","9170","9210","9246","9282","9305","9319","9358","9387","9415","9436","9480","9626","9743","9859","9945","9983","10188","10483","10562","10667","11325","11705","12677","12946","12829","13070","13494","13533","13589","13629","13668","13724","13783","14037","14688","15136","15289","15288","15074","15100","15164","15229","14945","14718","14392","14234","13267","13112","13030","12759","12558","12494","12340","12339","12491","12314","12492","12774","12775","12949","13073","13247","13489","13505","13613","13638","13658","13669","13689","13690","13698","13952","14194","14196","14453","14691","14940","15070","15061","15197","15372","15363","15362","15354","15200","15210","15204","15347","15338","15339","15460","15503","15620","15740","15929","16134","16216","16142","16022","16148","16291","16157","16350","16427","16493","16721","16881","17031","17183","17342","17450","17452","17602","17837","17876","17904","17922","17962","18015","18069","18104","18123","18173","18198","18199","18269","18532","18615","18769","19005","19139","19545","19719","19721","19839","19820","19787","19870","19963","20149","20265","20513","20714","20387","20447","20898","20954","20985","21045","21046","21110","21120","21203","21205","21157","21103","21037","20987","20962","20925","20897","20874","20858","20831","20787","20736","20670","20616","20539","20426","20334","20013","19838","19812","19777","19753","19733","19726","19710","19693","19672","19658","19657","19715","19716","19872","19771","19878","19833","19879","20255","20397","20398","20524","20673","20829","20684","20610","20538","20489","20620","20677","20933","21506","21879","21960","22026","22167","22327","22982","22938","23006","22959","23125","23126","23277","23864","3196","3209","24294","24320","24373","24360","24379","24452","24737","24911","24913","25035","25223","25395","25542","25543","25676","25722","26202","26324","26444","26528","26588","26458","26418","26417","26374","26318","26378","26264","26158","26157","26129","26035","26051","26030","25941","25942","26209","25756","25588","25589","25817","3425","26334","26487","26488","26697","27023","26688","26687","26537","26708","26608","26674","26584","26583","26642","26563","26495","26341","26339","26251","26131","26165","26196","26330","26466","26503","26602","26652","26994","26996","26995","27002","27366","27405","27406","27438","27531","27400","27486","27619","27741","27886","27961","28126","28287","28352","28485","28546","28651","28741","28806","28921","28967","29040","29041","29148","29053","28897","28896","28972","29144","28981","29146","29250","29331","29437","29640","29941","30144","30304","30452","30453","30573","30791","30794","30910","30970","31002","31003","31032","31211","31198","31405","31406","31546","31513","31550","31540","31539","31538","31357","31428","31430","31558","31301","31299","31363","31079","30898","31009","30885","30886","31077","31207","30891","30941","30890","30797","30762","30771","30787","30782","30871","30861","30851","30633","30593","30559","30594","30879","30955","31030","31111","31184","31333","31334","31401","31478","31568","31598","31672","31783","31860","31952","31973","31992","32086","32087","32199","32297","32236","32268","32336","32505","32506","32557","32722","32811","32893","32923","33009","33142","33224","33326","33411","33527","33572","33652","33633","33653","33644","33723","33800","33805","33841","33835","33845","34178","34179","34273","34193","34263","34322","34410","34412","34480","34551","34588","34589","34652","34732","34826","34874","34964","35026","35080","35116","35171","35172","35142","35211","35191","35213","35258","35319","35315","35314","35279","35214","35160","35098","35000","34931","34859","34706","34750","34767","34678","34698","34643","34571","34434","34354","34250","34238","34133","34125","34230","34311","34312","34305","34218","34292","34352","34353","34395","34429","34470","34590","34657","34692","34903","35093","35177","35261","35229","35228","35148","35243","35323","35324","35416","35529","35480","35569","35644","35705","35706","35672","35740","35813","35790","35789","35781","35779","35681","35756","35818","35820","35875","35901","35900","35860","35801","4538","35926","35955","36005","36007","36070","36126","36206","36272","36314","36387","36430","36479","36535","36572","36588","36603","36619","36630","36628","36629","36637","36679","36706","36708","36741","36760","36776","36787","36801","36818","36829","36837","36842","36871","36894","36935","36936","36938","36959","36944","36967","37063","37087","37140","37257","37280","37349","37382","37445","37493","37571","37626","37660","37661","37694","37751","37815","37784","37838","37870","37908","37985","38036","38037","38087","38179","38235","38312","38422","38423","38425","38533","38463","38462","38530","38556","38447","38387","38341","38344","38359","38369","38289","38250","38260","38253","38220","38171","38162","38149","38069","37994","37911","37837","37789","37734","37699","37656","37570","37456","37354","37346","37353","37373","37359","37358","37304","37253","37162","37143","37126","37105","37072","37053","37034","37029","37012","37001","36996","36993","36981","36963","36947","36914","36899","36878","36869","36862","36858","36852","36843","36832","36822","36812","36802","36789","36782","36769","36753","36744","36728","36711","36694","36675","36655","36609","36606","36548","36444","36360","36255","36183","36116","36042","35973","35930","35861","35794","35742","35689","35646","35594","35556","35500","35457","35335","34945","34736","34644","34523","34422","34286","34187","34087","33979","33825","33631","33313","33216","33151","32274","31969","31970","31924","31695","31669","31648","31511","31354","31276","31085","31076","31109","30922","30921","30926","30857","30674","30719","30517","30313","30103","29793","29700","29699","29570","29519","29554","29553","29376","29389","29402","29404","29416","29417","29418","29029"]
  #@a= ["5","6","7","5511","5496","5602","5767","5817","5866","5890"]
end

def calcular
  resultadoquery = metodoruta
  res={:success=>true, :content=>resultadoquery}
  render :text=>res.to_json
end

def metodoruta

  resultado = Array.new

    for i in 0 ... @a.length-1
      r = StreetRelation.find(:all,:conditions => ['roadmap_id = ? AND roadmap_related_id = ?',@a[i],@a[i+1]])

      r.each do |s|
        resultado.push({:id=>s.id, :roadmap_id=>s.roadmap_id, :roadmap_related_id=>s.roadmap_related_id,
        :lat_start=>s.lat_start, :long_start=>s.long_start, :lat_end=>s.lat_end, :long_end=>s.long_end,
        :stretch_type=>s.stretch_type })
      end
    end

#QuerY para pintar lineas del metro, cada una se debe pintar a parte mejor
=begin
  r = Roadmap.find(:all,:conditions => ['stretch_type in (?) AND municipality in (?)',[3],['MEDELLIN']])
    r.each do |s|
      resultado.push({:id=>s.id,
      :lat_start=>s.lat_start, :long_start=>s.long_start, :lat_end=>s.lat_end, :long_end=>s.long_end,
      :stretch_type=>s.stretch_type })
    end
=end
  puts "este es el resultado #{resultado} "
  resultado
end

end

