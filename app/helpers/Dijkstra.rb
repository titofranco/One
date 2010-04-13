class Dijkstra
  def self.encontrarCamino arrayCalles,inicio,destino
    m = arrayCalles.max{ |a,b| a.roadmap_id <=> b.roadmap_id}.roadmap_id
    # puts "maximo #{m}"
    nodos = []
    for i in 0... m
      nodos[i]=i
    end
    dist = Array.new(m,Float::MAX)
    prev = Array.new(m,nil)
    dist[inicio]=0.0
    prev[inicio]=nil
    distanciaR = 0.0
    act = inicio
    # puts "inicio"
    cont = 0
    while act != destino
      nodos.delete act
      u = nil
      enlaces = arrayCalles.find_all{ |n| n.roadmap_id == act}
      min = Float::MAX
      enlaces.each{ |e|
        # puts "conecta con #{e.roadmap_related_id} con distancia #{e.distance_meters}"
        alt = dist[act]+e.distance_meters
        if alt < dist[e.roadmap_related_id]
          dist[e.roadmap_related_id] = alt
          prev[e.roadmap_related_id] = act
        end
      }
      
      nodos.each{ |n|
        if dist[n]<min
          min = dist[n]
        end
      }
      # puts "distancia minima es #{min}"
      distanciaR = distanciaR+min
      act = dist.rindex distanciaR
      # puts "act despues de rindex #{act}"
      if !act
        temp = Float::MAX
        nodos.each{ |n|
          if dist[n]<temp
            act = n
          end
        }
      end
      # puts "act despues del ciclo #{act}"
      cont = cont.next
      # puts "contador #{cont}"
      if cont == 1000
        # puts "break por cont"
        break
      end
      break if min==Float::MAX     
    end

    # puts "salio"
    
    camino = Array.new
    while prev[destino] 
      camino << destino
      destino = prev[destino]
    end
    camino << inicio
    camino.reverse!
    # puts "fin"
    camino
  end
end
