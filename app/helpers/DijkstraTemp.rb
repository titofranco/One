require 'rubygems'
require 'algorithms'
class DijkstraTemp
  def self.encontrarCamino arrayCalles,inicio,destino       
    m = arrayCalles.length
    nodos = Array.new
    for i in 0...m
      nodos[i]=i
    end
    dist = Array.new(m,Float::MAX)
    prev = Array.new(m,nil)
    v = Array.new(m,false)
    heap = Containers::MinHeap.new
    dist[inicio]=0.0
    prev[inicio]=nil
    distanciaR = 0.0
    heap.push(0,inicio)
    cont = 0
    while !arrayCalles.empty?
      n = arrayCalles[heap.pop]
      # puts n.idNodo
      while v[n.idNodo]
        n = arrayCalles[heap.pop]
      end
      break if dist[n.idNodo] == Float::MAX
      if n.idNodo == destino
        camino = Array.new
        while prev[destino]
          camino.unshift destino
          destino = prev[destino]
        end
        camino.unshift inicio
        return camino
      end
      arrayCalles.delete n.idNodo
      n.enlaces.each{ |e|
        heap.push(e[1],e[0])
        alt = dist[n.idNodo]+e[1]
        if alt < dist[e[0]]
          dist[e[0]] = alt
          prev[e[0]] = n.idNodo
        end
      }
      v[n.idNodo] = true
    end
  end
end
