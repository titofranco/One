require "DijkstraTemp"
require "Parser"

puts "parsing..."
streets = Parser.getGrafo "listas.txt"
puts "numero de calles: #{streets.size}"
puts "inicio: #{Time.now}"
#Carlos-Joan
camino = DijkstraTemp.encontrarCamino streets,20235,6499
puts "fin: #{Time.now}"
puts ""
#Joan-Carlos
puts "inicio: #{Time.now}"
camino = DijkstraTemp.encontrarCamino streets,6499,20235
puts "fin: #{Time.now}"
