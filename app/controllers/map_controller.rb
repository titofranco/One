class MapController < ApplicationController

def calcular

  puts params[:initial_point]
  puts params[:end_point]
  redirect_to(:controller => "map", :action => "driving_directions" )
end

end

