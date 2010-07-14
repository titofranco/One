class MapController < ApplicationController

  def calcular
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
        busRoute = findUniqueBusNoWalk
        if !busRoute.empty?
          infoBus = parserRouteBus busRoute
          res={:success=>true, :content=>infoPath, :bus=>infoBus}
          render :text=>res.to_json
        else
          busRoute = findUniqueBusWalking pathDijkstra
          if !busRoute.empty?
            infoBus = parserRouteBus busRoute
            res={:success=>true, :content=>infoPath, :bus=>infoBus}
            render :text=>res.to_json
          end
        end
          
        
        
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
  
  def findUniqueBusWalking path
    # #metodo de carlos
    
    # rutasInicial = Array.new
    # rutasFinal = Array.new

    # #se encuentra los nodos cercanos al inicio y al final. Se guardan en
    # #cercaInicio y cercaFin respectivamente
    # cercaInicio =
    #   Roadmap.get_closest_points(@closest_init_point.lat_start.to_s,@closest_init_point.long_start.to_s,20)
    # cercaFin =
    #   Roadmap.get_closest_points(@closest_end_point.lat_start.to_s,@closest_end_point.long_start.to_s,20)

    # #Como los buses del final es estatico, se hace primero
    # #se encuentran los buses cercanos al final y se pasa a string
    # for n in cercaFin
    #   r = BusesRoute.find(:all,:select=>"bus_id",
    #                       :conditions=>["roadmap_id = ?",n.id])
    #   rutasFinal.push r if !r.empty?
    # end

    # rutasFinal = (rutasFinal.flatten).collect { |rr| rr.bus_id}
    # idRutasFinal = rutasFinal.uniq.join(",")    
    # puts "rutas cerca al final #{idRutasFinal}"
    
    # #se encuentra las rutas cercanas al inicio
    # rutas = Array.new
    # for n in cercaInicio
    #   ruta = BusesRoute.find(:all,:select=>"bus_id",
    #                       :conditions=>["roadmap_id = ?",n.id])
    #   # para cada ruta cercana al nodo qe se mira, se hace el query qe nos
    #   # dice si esta ruta empata con un nodo al final
    #   # en mi opinion, este for sobra por qe se puede comparar los id y ya.
    #   for r in ruta
    #     puts "n: #{n.id} r: #{r.bus_id} busesFinal: #{idRutasFinal}"
    #     #ademas de eso, el metodo get_closest_common_bus va 2 veces a base de
    #     #datos :)
    #     temp =
    #       BusesRoute.get_closest_common_bus(n.id,r.bus_id.to_s,idRutasFinal)

    #     #todavia no funciona, por qe si miras en consola, no encuentra nada
    #     #por eso las dos lineas siguientes estan comentariadas

    #     #rutas << temp[:bus_A]
    #     #rutas << temp[:bus_B]
    #   end
    # end

    # return rutas.uniq
    # fin metodo de carlos
    #--------------------------------------------------------

    #metodo de Joan
    puts Time.now
    rutasInicial = Array.new
    rutasFinal = Array.new
    
    #se encuentra los nodos cercanos al inicio y al final. Se guardan en
    #cercaInicio y cercaFin respectivamente

    cercaInicio =
      Roadmap.get_closest_points(@closest_init_point.lat_start.to_s,@closest_init_point.long_start.to_s,20)
    cercaFin =
      Roadmap.get_closest_points(@closest_end_point.lat_start.to_s,@closest_end_point.long_start.to_s,20)
    
    #se encuentra los buses cercanos al inicio

    for n in cercaInicio
      r = BusesRoute.find(:all,:select=>"bus_id",
                          :conditions=>["roadmap_id = ?",n.id])
      rutasInicial.push r if !r.empty?
    end

    rutasInicial = (rutasInicial.flatten).collect { |rr| rr.bus_id}
    puts "rutas cerca al inicio #{(rutasInicial).inspect}"

    #se encuentra los buses cercanos al final

    for n in cercaFin
      r = BusesRoute.find(:all,:select=>"bus_id",
                          :conditions=>["roadmap_id = ?",n.id])
      rutasFinal.push r if !r.empty?
    end

    rutasFinal = (rutasFinal.flatten).collect { |rr| rr.bus_id}
    puts "rutas cerca al final #{(rutasFinal).inspect}"    
    
    #se compara por id. si el bus x pasa cerca al inicio y al final, sirve
    rutasComunes = Array.new
    if !rutasInicial.empty? && !rutasFinal.empty?
      rutasComunes = (rutasInicial&rutasFinal)
      puts "rutas en comun: #{rutasComunes.inspect}"
    end
    puts Time.now
    rutasComunes
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
end
