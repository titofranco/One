class MapController < ApplicationController

  layout "standar"

  def find_route
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

        infoPath =
          getInfoPath(pathDijkstra,lat_start,long_start,lat_end,long_end)
        infoBus = nil
        busRoute = findUniqueBusNoWalk
        hi = nil
        if !busRoute.empty?
          infoBus = parserRouteBus busRoute
          # res={:success=>true, :content=>infoPath, :bus=>infoBus}
          # render :text=>res.to_json
        else
          busRoute = findUniqueBusWalking
          if !busRoute.empty?
            infoBus = parserRouteBus busRoute
            hi = busRoute.join('-')
            # res={:success=>true, :content=>infoPath, :bus=>infoBus}
            # render :text=>res.to_json
          end
        end
        #infoBus = BusesRoute.getOneBus
        #BusesRoute.get_closest_bus_id(44197)
        res={:success=>true, :content=>infoPath, :bus=>infoBus, :hi=>hi}
        render :text=>res.to_json
        # infoBus = nil
        # if !busRoute.nil?
        #   if busRoute.empty?
        #     busRoute = findBuses pathDijkstra
        #     infoBus = parserRouteBus busRoute
        #   elsif !busRoute.empty?
        #     infoBus = parserRouteBus busRoute
        #   end
        # end

      end
    end
  end

  def findUniqueBusNoWalk
    nodoI = @closest_init_point.id
    nodoD = @closest_end_point.id

    rutasI = BusesRoute.find(:all,:select=>"bus_id",
                             :conditions=>["roadmap_id = ?",nodoI])

    rutasD = BusesRoute.find(:all,:select=>"bus_id",
                             :conditions=>["roadmap_id = ?",nodoD])
    #string de los buses ID
    rutasI = (rutasI.flatten.collect { |i| i.bus_id}).uniq
    rutasD = (rutasD.flatten.collect { |i| i.bus_id}).uniq
    idBuses = Array.new

    if !rutasI.empty? && !rutasD.empty?
      sRutasI =rutasI.flatten.uniq.join(",")
      sRutasD =rutasD.flatten.uniq.join(",")

      puts "rutas Inicio #{sRutasI}"
      puts "rutas Dstino #{sRutasD}"

      conexiones = BusesRoute.get_common_bus(sRutasI,sRutasD)

      puts "test #{conexiones.first.inspect}"
      if !conexiones.empty?
        for c in conexiones
          conexiones.delete_if{
            |i| i.bus_id_A == c.bus_id_B && i.bus_id_B == c.bus_id_A
          }
          idBuses << c.bus_id_A
          idBuses << c.bus_id_B
        end
      end
    end
    return idBuses.uniq
  end

  #Busca si entre dos rutas de buses cercanas a el puntoInicial y Final
  #se debe caminar para coger una u otra
  def findUniqueBusWalking
    # #metodo de carlos
    collectionB = Array.new
    common_buses = Array.new
    rutas = Array.new

    # #se encuentra los nodos cercanos al inicio y al final. Se guardan en
    # #closeInitBuses y closeEndBuses respectivamente
     closeInitBuses = BusesRoute.get_closest_bus_id(@closest_init_point.id)
     if closeInitBuses
       closeEndBuses  = BusesRoute.get_closest_bus_id(@closest_end_point.id)
       if closeEndBuses
       end

       for reg in closeEndBuses
         collectionB.push(reg[:bus_id])
       end
       collectionA = closeInitBuses.collect{|t| t.attributes}
       puts "El conjunto A es #{collectionA}"
       puts "El conjunto B es #{collectionB.join(',')}"
       for reg in closeInitBuses
         r = BusesRoute.get_closest_common_bus(reg[:busrouteid],reg[:bus_id],collectionB.join(','))
         common_buses.push(r) if !r.empty?
       end
       common_buses = common_buses.flatten.uniq
       for reg in common_buses
         rutas << reg[:bus_A]
         rutas << reg[:bus_B]
       end
     end
    return rutas.uniq
  end


  def findBuses path

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
  
  def driving_directions
  end
  
end

