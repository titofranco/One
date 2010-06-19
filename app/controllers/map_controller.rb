class MapController < ApplicationController
  
  def calcular
    
    params_initial_point = params[:initial_point]
    params_end_point = params[:end_point]
    lat_start,long_start = params_initial_point.split(/,/)
    lat_end,long_end = params_end_point.split(/,/)

    @closest_init_point = Roadmap.get_closest_init_point(lat_start,long_start)
    if(@closest_init_point.empty?)
      res={:success=>false, :content=>"Debe de elegir un punto inicial más cercano"}
      render :text=>res.to_json
    else
      @closest_end_point = Roadmap.get_closest_end_point(lat_end,long_end)
      if @closest_end_point.empty? 
        res={:success=>false, :content=>"Debe de elegir un punto final más cercano"}
        render :text=>res.to_json
      else        
        #dijkstra
        puts "parsing..."
        streets = Parser.getGrafo "#{RAILS_ROOT}/lib/dijkstra/listas.txt"
        @pathDijkstra = Dijkstra.encontrarCamino streets,@closest_init_point.first.id,@closest_end_point.first.id
        #end dijkstra

        if @pathDijkstra.size == 0
          res={:success=>false, :content=>"Ruta no encontrada"}
          render :text=>res.to_json
          return nil
        end
        
        infoPath = getInfoPath(lat_start,long_start,lat_end,long_end)
       
        busRoute = findUniqueBus
        infoBus = parserRouteBus busRoute
        
        res={:success=>true, :content=>infoPath, :bus=>infoBus}
        render :text=>res.to_json
        
      end
    end
  end
  
  def parserRouteBus busRoute
    puts "oh hai, estoy en omgRuta"
    resultado = Array.new
    puts busRoute == nil
    puts "tamano de @ruta: #{busRoute.size}"
    for bus in busRoute
      #puts "bus: #{bus.inspect}"
      resultado.push(:id=>bus.id,
                     :bus_id=>bus.bus_id,
                     :lat_start=>bus.lat_start,
                     :long_start=>bus.long_start)
    end
    puts "tan tan taaaaan"
    puts resultado.inspect
    resultado
  end
  
  def findUniqueBus 
    nodoInicial = Roadmap.find(:all,:select=>"lat_start,long_start",
                               :conditions=>["lat_start = ? and long_start = ?",
                                             @closest_init_point.first.lat_start,
                                             @closest_init_point.first.long_start])
    
    nodoFinal = Roadmap.find(:all,:select=>"lat_start,long_start",
                             :conditions=>["lat_start = ? and long_start = ?",
                                           @closest_end_point.first.lat_start,
                                           @closest_end_point.first.long_start])
    rutasInicial = Array.new
    rutasFinal = Array.new
    # puts "Inicio"
    for n in nodoInicial 
      nn = Roadmap.get_closest_points(n.lat_start.to_s,n.long_start.to_s,20)
      for i in nn
        r = BusesRoute.find(:all,:select=>"bus_id,id,lat_start,long_start",
                            :conditions=>["roadmap_id = ?",i.id])
        rutasInicial.push r if !r.empty?
      end
    end
    
    # puts "Final"        
    for n in nodoFinal
      nn = Roadmap.get_closest_points(n.lat_start.to_s,n.long_start.to_s,20)
      for i in nn
        r = BusesRoute.find(:all,:select=>"bus_id,id,lat_start,long_start",
                            :conditions=>["roadmap_id = ?",i.id])
        
        rutasFinal.push r if !r.empty?
      end
    end
    rutasComunes = (rutasInicial&rutasFinal).compact
    puts "rutas en comun: #{rutasComunes.inspect}"
    rutasComunes.flatten
  end
  
  def getInfoPath(lat_start,long_start,lat_end,long_end)
    resultado = Roadmap.getRoute(@pathDijkstra,lat_start,long_start,lat_end,long_end)
    resultado
  end

  def findRouteBuses
    if resultado_bus.empty?
      res={:success=>false,:content=>"No se encontró ninguna ruta de bus"}
    else
      res={:success=>true,:content=>resultado_bus}
    end
    render :text=>res.to_json
  end 
end

