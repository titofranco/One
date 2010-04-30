class Dijkstra
  def self.encontrarCamino arrayCalles,inicio,destino       
    m = arrayCalles.length
    nodos = Array.new
    for i in 0... arrayCalles.length
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
      # puts "nodo: #{act}"
      nodos.delete act
      u = nil
      enlaces = arrayCalles[act]
      # puts "enlaces #{enlaces.inspect}"
      min = Float::MAX
      enlaces.each{ |e|
        # puts "conecta con #{e.idSiguiente} con distancia #{e.distancia}"
        alt = dist[act]+e.distancia
        if alt < dist[e.idSiguiente]
          dist[e.idSiguiente] = alt
          prev[e.idSiguiente] = act
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
      # if cont == 1000
      #   # puts "break por cont"
      #   break
      # end
      break if min==Float::MAX     
    end

    # puts "salio"
    
    camino = Array.new
    while prev[destino] 
      camino.unshift destino   # unshift es agregar al principio: libro ruby 447
      destino = prev[destino]
    end
    camino.unshift inicio
    # camino.reverse!
    # puts "fin"
    camino
  end
end
