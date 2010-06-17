# require 'parser'
# require 'dijkstra'

puts "parsing..."
streets = Parser.getGrafo "listas.txt"
puts "numero de calles: #{streets.size}"
#Carlos-Joan
inicio = 26918
destino = 20736
puts "camino de #{inicio} a #{destino}"
puts "inicio: #{Time.now}"
camino = Dijkstra.encontrarCamino streets,inicio,destino
puts "fin: #{Time.now}"
puts camino.inspect
puts camino.size

f = File.new("camino.txt","w+")
camino.each{ |l|
  f.write(l.to_s.concat(","))
}
f.close

