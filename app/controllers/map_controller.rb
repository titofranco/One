require "#{RAILS_ROOT}/app/helpers/Dijkstra"
require "#{RAILS_ROOT}/app/helpers/DijkstraTemp"
require "#{RAILS_ROOT}/app/helpers/AlgoritmoA"
require "#{RAILS_ROOT}/app/helpers/Parser"

class MapController < ApplicationController
  def calcular
    puts params[:initial_point]
    puts params[:end_point]
    redirect_to(:controller => "map", :action => "driving_directions" )
  end
  
  def calcularRuta
    puts "dioj mio!"
    @streets = Parser.getGrafo "#{RAILS_ROOT}/lib/Text_Files/listas.txt"
    puts "numero de calles: #{@streets.length}"
    # puts "gogo Dijkstra!"
    # @camino = Dijkstra.encontrarCamino @streets,1,48
    # puts "controlador #{@camino.inspect}"
    puts "gogo A*"
    a = AlgoritmoA.new
    @camino = a.encontrarCamino @streets,1,5253
  end

  def calcularTest
    puts "dioj mio!"
    @streets = Parser.getGrafo "#{RAILS_ROOT}/lib/Text_Files/listas.txt"
    puts "numero de calles: #{@streets.length}"
    puts "gogo Dijkstra TEST!"
    @camino = DijkstraTemp.encontrarCamino @streets,5,7
    puts "controlador #{@camino.inspect}"
  end
end
