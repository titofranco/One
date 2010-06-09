require 'rubygems'
require 'algorithms'

class Dijkstra
  def self.encontrarCamino arrayCalles,inicio,destino
    numCalles = arrayCalles.length
    nodoI = arrayCalles[inicio]
    nodoD = arrayCalles[destino]
    distanciaMax = distanceHarvesine(nodoI.lati,nodoI.longi,nodoD.lati,nodoD.longi)
    distanciaMax = distanciaMax + (distanciaMax*2)
    puts distanciaMax
    dist = Array.new(numCalles,Float::MAX)
    prev = Array.new(numCalles,nil)
    heap = Containers::MinHeap.new
    dist[inicio]=0.0
    prev[inicio]=nil
    heap.push(0,inicio)
    while heap.size > 0
      n = arrayCalles[heap.pop]
      next if n == nil
      break if dist[n.idNodo] == Float::MAX
      arrayCalles[n.idNodo]=nil
      numCalles = numCalles-1
      d = distanceHarvesine(n.lati,n.longi,nodoD.lati,nodoD.longi)
      # puts "#{n.idNodo}: #{dist[n.idNodo]} d:#{d}"
      next if d > distanciaMax
      str = "metio: "
      n.enlaces.each{ |e|
        alt = dist[n.idNodo]+e[1]
        if alt < dist[e[0]]
          dist[e[0]] = alt
          prev[e[0]] = n.idNodo
          heap.push(alt,e[0])
          str = str + e[0].to_s + ","
        end
      }
      # puts str
    end
    camino = Array.new
    while prev[destino]
      camino.unshift destino
      destino = prev[destino]
    end
    camino.unshift inicio

    #--
    if true
      puts "escribiendo en el archivo"
      cont = 0
      str = ""
      dist.each_with_index{ |d,i|
        if d != Float::MAX
        str = str + "#{cont.to_s}: #{d.to_s} f #{prev[i].to_s}\n"
      end
        cont = cont.next
      }
      f = File.new("#{inicio}.txt","w+")
      f.write str
      f.close
    end
    #--

    return camino
  end

  def self.distanceHarvesine(lat1,long1,lat2,long2)
    puts "#{lat1},#{long1} - #{lat2},#{long2}"
    to_rad=(Math::PI/180)
    dLong = long2 - long1
    dLat  = lat2 - lat1
    
    dLongRad = dLong*to_rad
    dLatRad  = dLat*to_rad
    lat1Rad  = lat1*to_rad
    lat2Rad  = lat2*to_rad
    long1Rad = long1*to_rad
    long2Rad = long2*to_rad
    
    a =(Math.sin(dLatRad/2))**2 + Math.cos(lat1Rad)*Math.cos(lat2Rad)*(Math.sin(dLongRad/2))**2
    c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    
    distanceMeters = c*6371000
    
    return distanceMeters
  end
end

