class MapController < ApplicationController


def calcular
 # @roadmap = Roadmap.new
 # @roadmap.latitud_longitud(params[:initial_point])
  puts "Punto Inicial: #{params[:initial_point]} "
  puts "Punto Final: #{params[:end_point]} "
  #puts "Saludo: #{params[:saludo]} "
  res={:success=>true, :content=>"esta es la respuesta del server"}
  render :text=>res.to_json

  #redirect_to(:controller => "map", :action => "driving_directions" )
end


end

