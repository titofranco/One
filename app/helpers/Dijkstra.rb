class Dijkstra

  def self.encontrarCamino arrayCalles,inicio,destino
    m = arrayCalles.max{ |a,b| a.roadmap_id <=> b.roadmap_id}
    nodos = []
    for i in 0... m.roadmap_id
      nodos[i]=i
    end
    dist = Array.new(numNodos,Float::MAX)
    prev = Array.new(numNodos,nil)
    dist[inicio]=0.0
    prev[inicio]=nil
    distanciaR = 0.0
    act = inicio
    while act != destino
      u = nil
      min = Float::MAX
      nodos.delete act
      enlaces = arrayCalles.find_all{ |n| n.roadmap_id = act}
      enlaces.each{ |e|
        #poner aca lo de la distancia
        alt = dist[act]+e.distance_meters
        if alt < dist[e.roadmap_related_id]
          dist[e.roadmap_related_id] = alt
          prev[e.roadmap_related_id] = act
        end
      }
      
    end
  end

  # def self.mensaje texto
  #   puts "resisas"
  #   
  # end

end
