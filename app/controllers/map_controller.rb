class MapController < ApplicationController

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
      if closest_end_point.empty? 
        res={:success=>false, :content=>"Debe de elegir un punto final más cercano"}
        render :text=>res.to_json
      else        
        #dijkstra
        puts "parsing..."
        streets = Parser.getGrafo "#{RAILS_ROOT}/lib/dijkstra/listas.txt"
        puts "numero de calles: #{streets.size}"
        #Carlos-Joan
        puts "camino de #{closest_init_point.first.id} a #{closest_end_point.first.id}"
        puts "inicio: #{Time.now}"
        camino = Dijkstra.encontrarCamino streets,closest_init_point.first.id,closest_end_point.first.id
        puts "fin: #{Time.now}"
        #puts camino.inspect
        puts camino.size
        @a = camino
        #end dijkstra
        if camino.size == 0
          puts "ACA ES FALSO"
          res={:success=>false, :content=>"Ruta no encontrada"}
          render :text=>res.to_json
        else
          puts "ACA ES VERDADERO"
          resultadoquery = getRuta(lat_start,long_start,lat_end,long_end)
          res={:success=>true, :content=>resultadoquery}
          render :text=>res.to_json
          
          #encontrar rutas de buses
          nodoInicial = Roadmap.find(:all,:select=>"id,lat_start,long_start",
                                     :conditions=>["lat_start = ? and long_start = ?",
                                                   closest_init_point.first.lat_start,
                                                   closest_init_point.first.long_start])
          
          nodoFinal = Roadmap.find(:all,:select=>"id,lat_start,long_start",
                                   :conditions=>["lat_start = ? and long_start = ?",
                                                 closest_end_point.first.lat_start,
                                                 closest_end_point.first.long_start])
          
          puts "nodos iniciales #{nodoInicial.inspect}"
          puts "nodos finales #{nodoFinal.inspect}"
          
          rutasInicial = Array.new
          rutasFinal = Array.new
          puts "Inicio"
          for n in nodoInicial 
            nn = Roadmap.get_closest_points(n.lat_start.to_s,long_start.to_s,20)
            for i in nn
              r = BusesRoute.find(:all,:select=>"bus_id",
                                  :conditions=>["roadmap_id = ?",i.id])
              if r.size>0
                rutasInicial.push r
              end
            end
          end
          
          puts "Final"        
          for n in nodoFinal
            nn = Roadmap.get_closest_points(n.lat_start.to_s,long_start.to_s,20)
            for i in nn
              r = BusesRoute.find(:all,:select=>"bus_id",
                                  :conditions=>["roadmap_id = ?",i.id])
              if r.size>0
                rutasFinal.push r
              end
            end
          end
          rutasComunes = rutasInicial&rutasFinal
          puts "rutas en comun: #{rutasComunes.inspect}"
        end
      end
    end
  end
  
  
  def getRuta(lat_start,long_start,lat_end,long_end)
    resultado = Roadmap.getRoute(@a,lat_start,long_start,lat_end,long_end)
    resultado
  end
  
  def calcularRuta
  end
  
  def findRouteBuses
    resultado_bus = BusesRoute.getOneBus
    if resultado_bus.empty?
      res={:success=>false,:content=>"No se encontró ninguna ruta de bus"}
    else
      res={:success=>true,:content=>resultado_bus}
    end
    render :text=>res.to_json
  end 
end

