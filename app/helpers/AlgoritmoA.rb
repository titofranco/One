require 'Calle'
class AlgoritmoA
  def encontrarCamino arrayCalles,inicio,fin
    cllInicio = arrayCalles[inicio]
    cllFin = arrayCalles[fin]
    evaluado = Array.new
    porEvaluar = Array.new
    porEvaluar[inicio] = inicio
    g_score = Array.new
    h_score = Array.new
    g_score[inicio] = 0
    h_score[inicio] = lineaRecta(cllInicio,cllFin)
    distancias[inicio] = h_score[inicio]
    anterior = Array.new
    puts "va para el while"
    while !porEvaluar.empty?
      n = grafo.min{ |a,b| a.distancia <=> b.distancia}
      puts "menor distancia #{n.inspect}"
      if n.idNodo == cllFin.idNodo
        puts "sisas!!!!"
        return anterior
      end

      porEvaluar.delete n
      evaluado[n.idNodo] = true
      arrayCalles[n].each{ |e|
        if evaluado[e.idNodo]
          next
        end
        posible = g_score[n] + e.distancia
        esPosible = false
        
        if !porEvaluar[e]
          porEvaluar[e.idSiguiente] = e
          esPosible = true
        elsif posible < g_score[e]
          esPosible = true
        else
          esPosible = false
        end

        if esPosible
          anterior[e.idSiguiente] = n
          g_score[e.idSiguiente] = posible
          h_score[e.idSiguiente] = lineaRecta(e,cllFin)
          f_score[e.idSiguiente] = g_score[e.idSiguiente]+h_score[e.idSiguiente]
        end
        }
    end
    return nil
  end

  # heuristica para evaluar a*
  def lineaRecta inicio,fin
    Math.sqrt((fin.lati-inicio.lati)**2+(fin.longi-inicio.longi)**2)
  end
end
