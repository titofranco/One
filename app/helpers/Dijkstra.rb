require 'Parser'
require 'Nodo'
class Dijkstra
  def encontrarCamino grafo,nodo,dest
    numNodos = grafo.size
    listaNodos = Array.new(numNodos)
    for i in 0...numNodos
      listaNodos[i]=i
    end
    dist = Array.new(numNodos,Float::MAX)
    prev = Array.new(numNodos,nil)
    dist[nodo]=0.0
    prev[nodo]=nil
    distanciaR = 0.0
    nodoI = nodo
    while nodo != dest
      listaNodos.delete nodo
      u = nil
      enlaces = grafo[nodo]
      min = Float::MAX
      enlaces.each{ |temp|
        alt = dist[nodo]+temp.distancia
        if alt < dist[temp.nodoDest]
          dist[temp.nodoDest] = alt
          prev[temp.nodoDest] = nodo
          if temp.distancia < min
            min = temp.distancia
          end
        end      
      }
      listaNodos.each{ |n|
        if dist[n]<min
          min = dist[n]
        end
      }
      distanciaR=distanciaR+min
      nodo = dist.rindex distanciaR
      if !nodo
        temp = Float::MAX
        listaNodos.each{ |n|
          if dist[n]<temp
            nodo = n
          end
        }
      end
      break if min==Float::MAX
    end   
    
    camino = Array.new
    while prev[dest] 
      camino << dest
      dest = prev[dest]
    end
    camino << nodoI
    camino.reverse!
    camino
  end
end

p = Parser.new
start = Time.now
puts "cargando grafo..."
g = p.crearGrafo "grafoMedellin.txt"
ends = Time.now
puts "se cargo el grafo en #{ends-start}"
d = Dijkstra.new
start = Time.now
puts "Buscando camino desde 4 a 29029. Empezamos #{start}"
c = d.encontrarCamino g,4,29029
ends = Time.now
puts "El camino es"
puts c.inspect
puts "se demoro #{start-ends}"
