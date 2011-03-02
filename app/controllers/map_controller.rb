class MapController < ApplicationController
  include SidePannel
  layout "standar"

  def find_route
    lat_start,long_start = params[:initial_point].split(/,/)
    lat_end,long_end = params[:end_point].split(/,/)
        
    path = Roadmap.get_path(lat_start,long_start,lat_end,long_end)

    if !path[:msg_error].blank?
      res={:success=>false, :content=>path[:msg_error]}
      render :text=>res.to_json
    else
      route_explain = SidePannel.explainRoute(path[:info_path])
      
      closest_init = (path[:info_path].first)[:roadmap_id]
      closest_final = (path[:info_path].last)[:roadmap_id]
      
      info_bus = nil
      route_bus = nil
      bus_explain = nil
      
      #new controller
      bus_route = BusesRoute.get_bus_route(closest_init,closest_final)
      info_bus = BusesRoute.parser_route_bus bus_route
      if !info_bus.empty?
        bus_explain = SidePannel.explainBusRoute(info_bus)  
      end     
     
      res={:success=>true,
        :content=>path[:info_path],
        :bus=>info_bus,
        :route_explain => route_explain,
        :bus_explain => bus_explain
      }    

      render :text=>res.to_json
      

# old controller
# <<<<<<< HEAD
#       #bus_route = BusesRoute.find_bus closest_init, closest_final
      
#       # puts path[:info_path].first.inspect
#       #  next
#       infoBus = nil
#       bus_route = findUniqueBusWalking(closest_init,closest_final)
      
      

#       if !bus_route.empty?
#         infoBus = parserRouteBus bus_route
#         # res={:success=>true, :content=>infoPath, :bus=>infoBus}
#         # render :text=>res.to_json
#       else
#         bus_route = findUniqueBusWalking
#         if !bus_route.empty?
#           infoBus = parserRouteBus bus_route
#           hi = bus_route.join('-')

#       infoBus = nil
#       busRoute = findUniqueBusNoWalk
   
#       if !busRoute.empty?
#         infoBus = parserRouteBus busRoute
#         # res={:success=>true, :content=>infoPath, :bus=>infoBus}
#         # render :text=>res.to_json
#       else
#         busRoute = findUniqueBusWalking
#         if !busRoute.empty?
#           infoBus = parserRouteBus busRoute

#           # res={:success=>true, :content=>infoPath, :bus=>infoBus}
#           # render :text=>res.to_json
#         end
#       end
     
#       #infoBus = BusesRoute.getOneBus
#       #BusesRoute.get_closest_bus_id(44197)

#       route_explain = SidePannel.explainRoute(path[:info_path])
#       bus_explain = SidePannel.explainBusRoute(infoBus)
#       res={:success=>true, :content=>path[:info_path], :bus=>infoBus, :route_explain => route_explain, :bus_explain => bus_explain}
# =======
      

      # if !bus_route.empty?
      #   infoBus = parserRouteBus bus_route
      #   # res={:success=>true, :content=>infoPath, :bus=>infoBus}
      #   # render :text=>res.to_json
      # else
      #   bus_route = findUniqueBusWalking
      #   if !bus_route.empty?
      #     infoBus = parserRouteBus bus_route
      #     hi = bus_route.join('-')
      #     # res={:success=>true, :content=>infoPath, :bus=>infoBus}
      #     # render :text=>res.to_json
      #   end
      # end
      # #infoBus = BusesRoute.getOneBus
      # #BusesRoute.get_closest_bus_id(44197)
      # res={:success=>true, :content=>path[:info_path], :bus=>infoBus}
      # render :text=>res.to_json
      # infoBus = nil
      # if !bus_route.nil?
      #   if bus_route.empty?
      #     bus_route = findBuses pathDijkstra
      #     infoBus = parserRouteBus bus_route
      #   elsif !bus_route.empty?
      #     infoBus = parserRouteBus bus_route
      #   end
      # end
      
    end
  end

#   protected
#   def findUniqueBusNoWalk nodoI, nodoD
# #    nodoI = @closest_initial.id
# #    nodoD = @closest_final.id
    
#     rutasI = BusesRoute.find(:all,:select=>"bus_id",
#                              :conditions=>["roadmap_id = ?",nodoI])

#     rutasD = BusesRoute.find(:all,:select=>"bus_id",
#                              :conditions=>["roadmap_id = ?",nodoD])
#     #string de los buses ID
#     rutasI = (rutasI.flatten.collect { |i| i.bus_id}).uniq
#     rutasD = (rutasD.flatten.collect { |i| i.bus_id}).uniq
#     idBuses = Array.new

#     if !rutasI.empty? && !rutasD.empty?
#       sRutasI =rutasI.flatten.uniq.join(",")
#       sRutasD =rutasD.flatten.uniq.join(",")


      #puts "rutas Inicio #{sRutasI}"
      #puts "rutas Dstino #{sRutasD}"

#       puts "rutas Inicio #{sRutasI}"
#       puts "rutas Dstino #{sRutasD}"


#       conexiones = BusesRoute.get_common_bus(sRutasI,sRutasD)

  #old controller
# <<<<<<< HEAD
#       #puts "test #{conexiones.first.inspect}"
#       if !conexiones.empty?
#         for c in conexiones
#           conexiones.delete_if{
#             |i| i.bus_id_A == c.bus_id_B && i.bus_id_B == c.bus_id_A
#           }
#           idBuses << c.bus_id_A
#           idBuses << c.bus_id_B
#         end
#       end
#     end
#     return idBuses.uniq
#   end
# =======
#       puts "test #{conexiones.first.inspect}"
#       if !conexiones.empty?
#         for c in conexiones
#           conexiones.delete_if{
#             |i| i.bus_id_A == c.bus_id_B && i.bus_id_B == c.bus_id_A
#           }
#           idBuses << c.bus_id_A
#           idBuses << c.bus_id_B
#         end
#       end
#     end
#     return idBuses.uniq
#   end
# >>>>>>> modify-controllers

#   #Busca si entre dos rutas de buses cercanas a el puntoInicial y Final
#   #se debe caminar para coger una u otra
#   def findUniqueBusWalking nodoI,nodoD
#     # #metodo de carlos
#     collectionB = Array.new
#     common_buses = Array.new
#     rutas = Array.new

# <<<<<<< HEAD
#     # #se encuentra los nodos cercanos al inicio y al final. Se guardan en
#     # #closeInitBuses y closeEndBuses respectivamente
#      closeInitBuses = BusesRoute.get_closest_bus_id(nodoI)
#      if closeInitBuses
#        closeEndBuses  = BusesRoute.get_closest_bus_id(nodoD)
#        unless closeEndBuses.compact.empty?
#          for reg in closeEndBuses
#            collectionB.push(reg[:bus_id])

#          end
         
#          puts "CLOSEINITBUSES #{closeInitBuses}"
#          puts "CLOSEENDBUSES #{closeEndBuses.empty?}"

#          end        
#          #puts "CLOSEINITBUSES #{closeInitBuses}"
#          #puts "CLOSEENDBUSES #{closeEndBuses.empty?}"

        
#          collectionA = closeInitBuses.collect{|t| t.attributes}
#          #puts "El conjunto A es #{collectionA}"
#          #puts "El conjunto B es #{collectionB.join(',')}"
#          for reg in closeInitBuses
#            r = BusesRoute.get_closest_common_bus(reg[:busrouteid],
#                                                  reg[:bus_id],collectionB.join(','))
#            common_buses.push(r) unless r.empty?
#          end
#          common_buses = common_buses.flatten.uniq
#          for reg in common_buses
#            rutas << reg[:bus_A]
#            rutas << reg[:bus_B]
#          end              
#        end  
#      end
#     return rutas.uniq
#   end


#   def parserRouteBus bus_route
#     resultado = Array.new
#     for idBus in bus_route
#       buses = BusesRoute.find(:all,:select=>"id,bus_id,lat_start,long_start",
#                             :conditions=>["bus_id = ?",idBus])
#       for bus in buses
#         resultado.push(:id=>bus.id,
#                        :bus_id=>bus.bus_id,
#                        :lat_start=>bus.lat_start,
#                        :long_start=>bus.long_start,
#                        :status => 'inactive'
#                        )
#       end
#     end
#     size = resultado.length
    
#     #This fake record is to make comparisons and for getting the lat-lng from the last record   
#     resultado.push( :id => -1,
#                     :bus_id => 99999,
#                     :lat_start => resultado[size-1][:lat_start],
#                     :long_start => resultado[size-1][:long_start],
#                     :status => 'inactive'
#                   )  

    
#     resultado
#   end

#   def findRouteBuses
#     if resultado_bus.empty?
#       res={:success=>false,:content=>"No se encontró ninguna ruta de bus"}
#     else
#       res={:success=>true,:content=>resultado_bus}
#     end
#     render :text=>res.to_json
#   end
 
# =======
#     # #se encuentra los nodos cercanos al inicio y al final. Se guardan en
#     # #closeInitBuses y closeEndBuses respectivamente
#      closeInitBuses = BusesRoute.get_closest_bus_id(nodoI)
#      if closeInitBuses
#        closeEndBuses  = BusesRoute.get_closest_bus_id(nodoD)
#        unless closeEndBuses.compact.empty?
#          for reg in closeEndBuses
#            collectionB.push(reg[:bus_id])
#          end
         
#          puts "CLOSEINITBUSES #{closeInitBuses}"
#          puts "CLOSEENDBUSES #{closeEndBuses.empty?}"
        
#          collectionA = closeInitBuses.collect{|t| t.attributes}
#          puts "El conjunto A es #{collectionA}"
#          puts "El conjunto B es #{collectionB.join(',')}"
#          for reg in closeInitBuses
#            r = BusesRoute.get_closest_common_bus(reg[:busrouteid],
#                                                  reg[:bus_id],collectionB.join(','))
#            common_buses.push(r) unless r.empty?
#          end
#          common_buses = common_buses.flatten.uniq
#          for reg in common_buses
#            rutas << reg[:bus_A]
#            rutas << reg[:bus_B]
#          end              
#        end  
#      end
#     return rutas.uniq
#   end


#   def parserRouteBus bus_route
#     resultado = Array.new
#     for idBus in bus_route
#       buses = BusesRoute.find(:all,:select=>"id,bus_id,lat_start,long_start",
#                             :conditions=>["bus_id = ?",idBus])
#       for bus in buses
#         resultado.push(:id=>bus.id,
#                        :bus_id=>bus.bus_id,
#                        :lat_start=>bus.lat_start,
#                        :long_start=>bus.long_start)
#       end
#     end
#     resultado
#   end

#   def findRouteBuses
#     if resultado_bus.empty?
#       res={:success=>false,:content=>"No se encontró ninguna ruta de bus"}
#     else
#       res={:success=>true,:content=>resultado_bus}
#     end
#     render :text=>res.to_json
#   end
  
#   def driving_directions
#   end
  
# >>>>>>> modify-controllers
end
