class Nodo
  attr_accessor :distancia,:nodoDest
  #attr_reader :distancia,:nodoDest
  def initialize nodo,d
    @distancia = d
    @nodoDest = nodo
  end
  
  def to_s
    "destino #{@nodoDest} distancia #{@distancia} "
  end
end
