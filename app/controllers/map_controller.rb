require "#{RAILS_ROOT}/app/helpers/Dijkstra"
class MapController < ApplicationController
  def calcular
    puts params[:initial_point]
    puts params[:end_point]
    redirect_to(:controller => "map", :action => "driving_directions" )
  end
  
  def calcularRuta
    @streets = StreetRelation.getMatrix
    @camino = Dijkstra.encontrarCamino @streets,4,29029
    puts "controlador #{@camino.inspect}"
  end
end
