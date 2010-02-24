require 'Mda'
require 'csv'


task :creating_file => :environment  do

  include ActionView::Helpers::NumberHelper
  row = Streetrelation.maximum(:maproad_id)
  column = Streetrelation.maximum(:maproad_related_id)
  puts "max row #{row}"
  puts "max column #{column}"
  matrix_size = row*column
  matrix_bytes = matrix_size*4
  puts "A matrix of #{row}x#{column} uses #{number_to_human_size(matrix_bytes)} "
  iniTime = Time.now
  puts "#The initial Time: #{iniTime} "
  mda = Mda.new(row,column)
  puts  "#{Time.now - iniTime} seconds for creating the matrix}"
  begin
    csv = CSV.open("#{RAILS_ROOT}/lib/initial_matrix.csv","r")
    csv.each_with_index do |row,i|
      row,column,distance_meters = row
      mda.fill_array(row,column,distance_meters)
      puts "#{i} records in matrix " if i % 1000 == 0
   end
  ensure
    csv.close unless csv.nil?
  end

  puts  "#{Time.now - iniTime} seconds for filling the matrix}"
  mda.cre fueate_file
  puts  "#{ Time.now -iniTime} total seconds of the task "

end

