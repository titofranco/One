require 'Calle'
class Parser
  def self.getGrafo nombreArchivo 
    grafo = Array.new
    f = File.new(nombreArchivo,"r")
    f.each do |line|
      # puts "\nseparando #{line}"
      temp = line.split(":")
      id = temp.first.to_i
      temp = temp.last
      temp2 = Array.new
      temp.each do |subline|
        temp2 = subline.split("&")
      end
      # puts "sin & #{temp2.inspect}"
      temp3 = Array.new
      temp2.each do |subline|
        temp3 << subline.split(";")
      end
      # puts "sin ; #{temp3.inspect}"
      coordenadas = temp3.last
      # puts "coordenadas #{coordenadas.inspect}"
      lati = coordenadas.first.to_f
      longi = coordenadas.last.to_f
      temp3.delete coordenadas
      # puts "sin coordenadas #{temp3.inspect}"
      temp2.clear
      temp3 = temp3.flatten
      temp3.each do |subline|
        temp2 << subline.split(",")
      end
      #puts "sin , #{temp2.inspect}"
      enlaces = Array.new
      tipo = nil
      temp2.each{ |c|
        # puts "chanfle #{c.inspect}"
        # cll.idSiguiente = c[0].to_i
        # cll.distancia = c[1].to_f
        tipo = c[2].to_i
        enlaces.push [c[0].to_i,c[1].to_f]
        # grafo[id] = enlaces
      }
      cll = Calle.new
      cll.idNodo = id
      cll.lati = lati
      cll.longi = longi
      cll.enlaces = enlaces
      cll.tipo = tipo
      grafo[id] = cll
      # puts "\nenlaces de #{id}: #{enlaces.inspect}"
      
    end
    # puts "grafo en parser"
    grafo
  end
end


# start = Time.now
# puts "se fue"
# g = Parser.getGrafo "miniListas.txt"
# g.each{ |a|
#   puts a.to_s
# }
# ends = Time.now
# puts "tada #{ends-start}"
