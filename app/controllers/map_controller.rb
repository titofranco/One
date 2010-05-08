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
@init_point
@end_point
end

def calcular

  params_initial_point = params[:initial_point]
  params_end_point = params[:end_point]
  lat_start,long_start = params_initial_point.split(/,/)
  lat_end,long_end = params_end_point.split(/,/)
  closest_init_point = Roadmap.get_closest_init_point(lat_start,long_start)
  if(closest_init_point.empty?)
    res={:success=>false, :content=>"Debe de elegir un punto inicial más cercano"}
    render :text=>res.to_json
  else
    closest_end_point = Roadmap.get_closest_end_point(lat_end,long_end)
    if(closest_end_point.empty?)
      res={:success=>false, :content=>"Debe de elegir un punto final más cercano"}
      render :text=>res.to_json
    else
      resultadoquery = metodoruta(lat_start,long_start,lat_end,long_end)
      res={:success=>true, :content=>resultadoquery}
      render :text=>res.to_json
    end
  end
end


def metodoruta(lat_start,long_start,lat_end,long_end)
  resultado = Roadmap.getRoute(@a,lat_start,long_start,lat_end,long_end)
  resultado
end

def calcularRuta
end

end

