require 'Nodo'
require 'Ruta'
require 'Dijkstra'
require 'Parser'
class Test
  def definirGrafo
    # grafo = Array.new
    # grafo[0]=[Nodo.new(1,20),Nodo.new(3,80),Nodo.new(6,90)]
    # grafo[1]=[Nodo.new(5,10)]
    # grafo[2]=[Nodo.new(3,10),Nodo.new(5,50),Nodo.new(7,20)]
    # grafo[3]=[Nodo.new(2,10),Nodo.new(6,20)]
    # grafo[4]=[Nodo.new(1,50),Nodo.new(6,30)]
    # grafo[5]=[Nodo.new(2,10)]
    # grafo[6]=[Nodo.new(0,20)]    
    # grafo[7]=[]
    p = Parser.new
    grafo = p.crearGrafo "grafoMedellin.txt"
    grafo
  end

  def definirRutas
    rutas = Array.new
    rutas << Ruta.new("001",[0,1,5])
    rutas << Ruta.new("002",[2,3,6])
    rutas << Ruta.new("003",[1,2,3])
    rutas << Ruta.new("004",[3,6])
    rutas << Ruta.new("005",[0,1])
    rutas << Ruta.new("006",[1,5,2])
    rutas << Ruta.new("007",[2,3,6])
    rutas << Ruta.new("008",[5,2])
    #rutas << Ruta.new("x", [0,1,5,2,3])
    rutas << Ruta.new("no",[0,6,3])
    rutas                        
  end
  
  def ruta camino,grafo,rutas
    lista = Array.new
    rutas.each{ |ruta|
      t = camino & ruta.nodos
      puts "#{camino.inspect} > #{ruta.nodos.inspect} t #{t.inspect}"
      if camino.size >= ruta.nodos.size
        if(camino.join("|").to_s.include?(t.join("|").to_s))
          lista.push ruta
        end
      else
        if(t.join("|").to_s.include?(camino.join("|").to_s))
          lista.push ruta
        end
      end
    }
    puts "rutas qe sirven:"
    lista.each{ |x| x.to_s}
    esqina = camino.first
    chanfle = Array.new
    noInf = 0
    while !camino.empty? && esqina != camino.last
      puts "estoy en #{esqina} y falta #{camino.inspect}"
      rutasEsqina = lista.find_all{
        |r| r.nodos.find { |n| n == esqina } && r.nodos.last != esqina
      }
      mejorRuta=rutasEsqina.max {|a,b| (camino && a.nodos).length <=>
        (camino && b.nodos).length }
      
      puts "mejorRuta #{mejorRuta.inspect}"
      if mejorRuta != nil
        nodosComunes = camino & mejorRuta.nodos
        puts "nodos comunes #{nodosComunes.inspect}"
        chanfle << [mejorRuta.ruta,esqina,nodosComunes.last]
        esqina = nodosComunes.last
        nodosComunes.each{ |n|
          camino.delete n
        }
      else
        # sigEsqina = camino.rindex esqina
        # puts sigEsqina
        # sigEsqina = sigEsqina.next
        chanfle << [nil,esqina,camino.first]
        esqina = camino.first
        camino.delete camino.first
      end
      noInf = noInf.next
    end
    puts chanfle.inspect
  end
end

t = Test.new
d = Dijkstra.new
g = t.definirGrafo
r = t.definirRutas
camino = d.encontrarCamino g,0,6
puts "camino #{camino.inspect}"
if camino.size > 1
  t.ruta camino,g,r
end
