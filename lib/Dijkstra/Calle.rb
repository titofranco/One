class Calle
  attr_accessor :idNodo, :enlaces, :tipo, :lati, :longi
  def to_s
    "idNodo: #{idNodo}, lati: #{lati}, longi: #{longi}\nenlaces: #{enlaces.inspect}"
  end
end
