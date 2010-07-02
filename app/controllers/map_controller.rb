class MapController < ApplicationController

  def calcular
    puts "Tiempo inicial #{initTime}"
    params_initial_point = params[:initial_point]
    params_end_point = params[:end_point]
    lat_start,long_start = params_initial_point.split(/,/)
    lat_end,long_end = params_end_point.split(/,/)

    @closest_init_point = (Roadmap.get_closest_init_point(lat_start,long_start)).first
    if @closest_init_point.eql?nil
      res={:success=>false, :content=>"Debe de elegir un punto inicial más cercano"}
      render :text=>res.to_json
    else
      @closest_end_point = (Roadmap.get_closest_end_point(lat_end,long_end)).first
      if @closest_end_point.eql?nil
        res={:success=>false, :content=>"Debe de elegir un punto final más cercano"}
        render :text=>res.to_json
      else
        #dijkstra
        puts "parsing..."
        streets = Parser.getGrafo "#{RAILS_ROOT}/lib/dijkstra/listas.txt"
        pathDijkstra = Dijkstra.encontrarCamino streets,@closest_init_point.id,@closest_end_point.id
        #end dijkstra

        if pathDijkstra.size == 0
          res={:success=>false, :content=>"Ruta no encontrada"}
          render :text=>res.to_json
          return nil
        end

        infoPath = getInfoPath(pathDijkstra,lat_start,long_start,lat_end,long_end)
        busRoute = findUniqueBus
        infoBus = nil
        if !busRoute.empty?
          infoBus = parserRouteBus busRoute
        else
          busRoute = findBuses pathDijkstra
          infoBus = parserRouteBus busRoute
        end
        res={:success=>true, :content=>infoPath, :bus=>infoBus}
        render :text=>res.to_json
      end
    end
  end

  def findUniqueBus
    rutasInicial = Array.new
    rutasFinal = Array.new

    cercaInicio =
      Roadmap.get_closest_points(@closest_init_point.lat_start.to_s,@closest_init_point.long_start.to_s,20)
    cercaFin =
      Roadmap.get_closest_points(@closest_end_point.lat_start.to_s,@closest_end_point.long_start.to_s,20)

    for n in cercaInicio
      r = BusesRoute.find(:all,:select=>"bus_id",
                          :conditions=>["roadmap_id = ?",n.id])
      rutasInicial.push r if !r.empty?
    end

    rutasInicial = (rutasInicial.flatten).collect { |rr| rr.bus_id}
    puts "rutas cerca al inicio #{(rutasInicial).inspect}"

    for n in cercaFin
      r = BusesRoute.find(:all,:select=>"bus_id",
                          :conditions=>["roadmap_id = ?",n.id])
      rutasFinal.push r if !r.empty?
    end

    rutasFinal = (rutasFinal.flatten).collect { |rr| rr.bus_id}
    puts "rutas cerca al final #{(rutasFinal).inspect}"

    rutasComunes = (rutasInicial&rutasFinal)
    puts "rutas en comun: #{rutasComunes.inspect}"
    rutasComunes
  end

  def findBuses path
    rutas = Array.new
    closeToNode = Array.new
    for node in path
      # temp = (Roadmap.find(:all,:select=>"lat_start,long_start",
      #                      :conditions=>["id = ?",node])).first
      # closeToNode =
      #   Roadmap.get_closest_points(temp.lat_start.to_s,temp.long_start.to_s,20)
      # puts "cercanos :#{closeToNode.size}"

      #closeToNode = Roadmap.get_closest_point_by_id node
      n = Roadmap.get_closest_point_by_id node
      for a in n
        closeToNode.push(a.id)
      end
    end

    closeToNode = closeToNode.flatten.uniq
    puts "close node #{closeToNode.join(",")}"
    for i in 0 ... closeToNode.size
      r = BusesRoute.find(:all,:select=>"bus_id",
                          :conditions=>["roadmap_id = ?",closeToNode[i]])
      rutas.push r if !r.empty?
    end
    rutas = (rutas.flatten.collect { |i| i.bus_id}).uniq
    rutas
  end

  def getInfoPath(pathDijkstra,lat_start,long_start,lat_end,long_end)
    resultado = Roadmap.getRoute(pathDijkstra,lat_start,long_start,lat_end,long_end)
    resultado
  end


  def parserRouteBus busRoute
    resultado = Array.new
    for idBus in busRoute
      buses = BusesRoute.find(:all,:select=>"id,bus_id,lat_start,long_start",
                            :conditions=>["bus_id = ?",idBus])
      for bus in buses
        resultado.push(:id=>bus.id,
                       :bus_id=>bus.bus_id,
                       :lat_start=>bus.lat_start,
                       :long_start=>bus.long_start)
      end
    end
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

