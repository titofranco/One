class StreetController < ApplicationController
  def index
    @streets = StreetRelation.getMatrix
  end
end
