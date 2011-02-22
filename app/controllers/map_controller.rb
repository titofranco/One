class MapController < ApplicationController

  layout "standar"

  def find_route
    lat_start,long_start = params[:initial_point].split(/,/)
    lat_end,long_end = params[:end_point].split(/,/)

    path = Roadmap.get_path(lat_start,long_start,lat_end,long_end)
    
    if !path[:msg_error].blank?
      res={:success=>false, :content=>path[:msg_error]}
      render :text=>res.to_json
    else
      
      @closest_initial = Roadmap.get_closest_points(lat_start,long_start)
      @closest_final = Roadmap.get_closest_points(lat_end,long_end)
      
      
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
      res={:success=>true, :content=>path[:info_path], :bus=>infoBus, :hi=>hi}
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

  protected
  def findUniqueBusNoWalk
    nodoI = @closest_initial.id
    nodoD = @closest_final.id
    
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
     closeInitBuses = BusesRoute.get_closest_bus_id(@closest_initial.id)
     if closeInitBuses
       closeEndBuses  = BusesRoute.get_closest_bus_id(@closest_final.id)
       unless closeEndBuses.compact.empty?
         for reg in closeEndBuses
           collectionB.push(reg[:bus_id])
         end        
         puts "CLOSEINITBUSES #{closeInitBuses}"
         puts "CLOSEENDBUSES #{closeEndBuses.empty?}"
        
         collectionA = closeInitBuses.collect{|t| t.attributes}
         puts "El conjunto A es #{collectionA}"
         puts "El conjunto B es #{collectionB.join(',')}"
         for reg in closeInitBuses
           r = BusesRoute.get_closest_common_bus(reg[:busrouteid],reg[:bus_id],collectionB.join(','))
           common_buses.push(r) unless r.empty?
         end
         common_buses = common_buses.flatten.uniq
         for reg in common_buses
           rutas << reg[:bus_A]
           rutas << reg[:bus_B]
         end              
       end  
     end
    return rutas.uniq
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
