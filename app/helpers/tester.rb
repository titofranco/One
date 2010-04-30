require "Dijkstra"
require "DijkstraTemp"
require "AlgoritmoA"
require "Parser"

puts "parsing..."
streets = Parser.getGrafo "listas.txt"
puts "numero de calles: #{streets.size}"
inicio = Time.now
puts "inicio: #{inicio}"
camino = DijkstraTemp.encontrarCamino streets,1,5253
fin = Time.now
puts "fin: #{fin}"
puts "se demoro #{(fin-inicio)/60}"
puts camino.inspect

