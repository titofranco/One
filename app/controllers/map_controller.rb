require "#{RAILS_ROOT}/app/helpers/Dijkstra"
require "#{RAILS_ROOT}/app/helpers/DijkstraTemp"
require "#{RAILS_ROOT}/app/helpers/AlgoritmoA"
require "#{RAILS_ROOT}/app/helpers/Parser"
  
class MapController < ApplicationController
  def calcular
    resultadoquery = metodoruta
    res={:success=>true, :content=>resultadoquery}
    render :text=>res.to_json
  end
  
  def metodoruta
    resultado = Array.new
    #QuerY para pintar lineas del metro, cada una se debe pintar a parte mejor
    =begin
       r = Roadmap.find(:all,:conditions => ['stretch_type in (?) AND municipality in (?)',[3],['MEDELLIN']])
       r.each do |s|
        resultado.push({:id=>s.id,
                         :lat_start=>s.lat_start, :long_start=>s.long_start, :lat_end=>s.lat_end, :long_end=>s.long_end,
                         :stretch_type=>s.stretch_type })
      end
       =end
    for i in 0 ...@a.length
      if StreetRelation.exists?(:roadmap_id=>@a[i], :roadmap_related_id=>@a[i+1])
        route = StreetRelation.find_by_sql ["Select s.id,s.lat_start,s.long_start,s.lat_end,s.long_end,s.stretch_type, "+
                                            "a.way_type as way_type_a,a.street_name as street_name_a, "+
                                            "a.prefix as prefix_a,a.label as label_a, "+
                                            "b.way_type as way_type_b,b.street_name as street_name_b, "+
                                            "b.prefix as prefix_b,b.label as label_b "+
                                            "from street_relations s "+
                                            "inner join roadmaps as a "+
                                            "on(a.id = s.roadmap_id) "+
                                            "inner join roadmaps as b "+
                                            "on(b.id = s.roadmap_related_id) "+
                                            "where roadmap_id = ? AND roadmap_related_id = ?",@a[i],@a[i+1]]
        
        route = route[0]
        resultado.push({:id=>route.id,:lat_start=>route.lat_start, :long_start=>route.long_start,
                         :lat_end=>route.lat_end,:long_end=>route.long_end,:stretch_type=>route.stretch_type,
                         :way_type_a=>route.way_type_a,:street_name_a=>route.street_name_a,:prefix_a=>route.prefix_a,
                         :label_a=>route.label_a,:way_type_b=>route.way_type_b,:street_name_b=>route.street_name_b,
                         :prefix_b=>route.prefix_b,:label_b=>route.label_b })
      else
        puts "El registro para roadmap_id #{@a[i]} roadmap_related_id:#{@a[i+1]} no está en la BD"
      end
    end
    resultado
  end
  
  def calcular
    resultadoquery = metodoruta
    res={:success=>true, :content=>resultadoquery}
    render :text=>res.to_json
  end
  
  def metodoruta
    resultado = Array.new
    
    #QuerY para pintar lineas del metro, cada una se debe pintar a parte mejor
    =begin
       r = Roadmap.find(:all,:conditions => ['stretch_type in (?) AND municipality in (?)',[3],['MEDELLIN']])
       r.each do |s|
        resultado.push({:id=>s.id,
                         :lat_start=>s.lat_start, :long_start=>s.long_start, :lat_end=>s.lat_end, :long_end=>s.long_end,
                         :stretch_type=>s.stretch_type })
      end
       =end
    for i in 0 ...@a.length
      if StreetRelation.exists?(:roadmap_id=>@a[i], :roadmap_related_id=>@a[i+1])
        route = StreetRelation.find_by_sql ["Select s.id,s.lat_start,s.long_start,s.lat_end,s.long_end,s.stretch_type, "+
                                            "a.way_type as way_type_a,a.street_name as street_name_a, "+
                                            "a.prefix as prefix_a,a.label as label_a, "+
                                            "b.way_type as way_type_b,b.street_name as street_name_b, "+
                                            "b.prefix as prefix_b,b.label as label_b "+
                                            "from street_relations s "+
                                            "inner join roadmaps as a "+
                                            "on(a.id = s.roadmap_id) "+
                                            "inner join roadmaps as b "+
                                            "on(b.id = s.roadmap_related_id) "+
                                            "where roadmap_id = ? AND roadmap_related_id = ?",@a[i],@a[i+1]]
        
        route = route[0]
        resultado.push({:id=>route.id,:lat_start=>route.lat_start, :long_start=>route.long_start,
                         :lat_end=>route.lat_end,:long_end=>route.long_end,:stretch_type=>route.stretch_type,
                         :way_type_a=>route.way_type_a,:street_name_a=>route.street_name_a,:prefix_a=>route.prefix_a,
                         :label_a=>route.label_a,:way_type_b=>route.way_type_b,:street_name_b=>route.street_name_b,
                         :prefix_b=>route.prefix_b,:label_b=>route.label_b })
      else
        puts "El registro para roadmap_id #{@a[i]} roadmap_related_id:#{@a[i+1]} no está en la BD"
      end
    end
    resultado
    
  end
  def calcularRuta
    puts "dioj mio!"
    @streets = Parser.getGrafo "#{RAILS_ROOT}/lib/Text_Files/listas.txt"
    puts "numero de calles: #{@streets.length}"
    # puts "gogo Dijkstra!"
    # @camino = Dijkstra.encontrarCamino @streets,1,48
    # puts "controlador #{@camino.inspect}"
    puts "gogo A*"
    a = AlgoritmoA.new
    @camino = a.encontrarCamino @streets,1,5253
  end
end
