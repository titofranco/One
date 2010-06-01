require "Dijkstra"
require "AlgoritmoA"
require "Parser"

puts "parsing..."
streets = Parser.getGrafo "listas.txt"
puts "numero de calles: #{streets.size}"
#Carlos-Joan
puts "inicio: #{Time.now}"
camino = Dijkstra.encontrarCamino streets,20235,6499
puts "fin: #{Time.now}"
puts camino.inspect
puts camino.size

#Joan-Carlos
# puts "inicio: #{Time.now}"
# camino = Dijkstra.encontrarCamino streets,6499,20235
# puts "fin: #{Time.now}"
# puts camino.inspect
# puts camino.size

#ruta 4
# puts "inicio: #{Time.now}"
# camino = Dijkstra.encontrarCamino streets,30060,13729
# puts "fin: #{Time.now}"
# puts camino.inspect
# puts camino.size

#test
# puts "inicio: #{Time.now}"
# camino = Dijkstra.encontrarCamino streets,12668,6499
# puts "fin: #{Time.now}"
# puts camino.inspect
# puts camino.size

f = File.new("camino","w+")
camino.each{ |l|
  f.write(l.to_s.concat(","))
}
f.close
