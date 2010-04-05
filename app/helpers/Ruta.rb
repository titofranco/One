class Ruta
  attr_accessor :ruta,:nodos
  def initialize ruta,nodos
    @ruta = ruta
    @nodos = nodos
  end
  
  def to_s
    puts "ruta #{@ruta}: #{@nodos.inspect} "
  end
end
