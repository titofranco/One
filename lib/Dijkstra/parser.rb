#require "#{RAILS_ROOT}/lib/Dijkstra/Calle"
require "Calle"

class Parser
  def self.getGrafo rutaArchivo
    grafo = Array.new
    f = File.new(rutaArchivo,"r")
    f.each do |line|
      cll = Calle.new
      temp = line.split ":"
      cll.idNodo = temp.first.to_i
      temp = temp.last
      temp = temp.split "&"
      coordenadas = temp.last.split ","
      temp = temp.first
      cll.lati = coordenadas.first.to_f
      cll.longi = coordenadas.last.to_f
      temp = temp.split ";"
      enlaces = Array.new
      temp.each { |e|
        e = e.split ","
        cll.tipo = e[3].to_i
        enlaces.push [e[0].to_i,e[1].to_f]

      }
      cll.enlaces = enlaces
      grafo[cll.idNodo] = cll
    end
    grafo
  end
end

