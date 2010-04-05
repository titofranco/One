require 'Nodo'
class Parser
  def crearGrafo nombreArchivo 
    grafo = Array.new
    f = File.open(nombreArchivo,"r")
    f.each do |line|
      temp = line.split(":")
      nodoI = temp.first
      temp.delete nodoI
      nodoI = nodoI.to_f
      temp2 = Array.new
      temp.each do |subline|
        temp2 = subline.split(";")
      end
      temp3 = Array.new
      temp2.each do |subline|
        temp3<<subline.split(",")
      end
      enlaces = Array.new
      temp3.each do |subline|
        if subline[0] != "\n"
          enlaces << Nodo.new(subline[0].to_i,subline[1].to_f)
        end 
      end
      grafo[nodoI] = enlaces
    end
    grafo
  end
end

# p = Parser.new
# start = Time.now
# puts "se fue"
# p.crearGrafo "listas.txt"
# ends = Time.now
# puts "tada #{ends-start}"
