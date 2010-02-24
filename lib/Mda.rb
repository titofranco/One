
class Mda

def initialize(rows,columns)
  @max_row = rows
  @max_column = columns
  @a = Array.new(rows)
  @a.map! { Array.new(columns) }
end

def fill_array(row,column,value)
    @a[row-1][column-1]=value
end


def create_file

  file = File.new("archivo.txt","w+")
  begin
    for i in 0 ... @max_row
      for j in 0 ... @max_column
        file.printf @a[i][j].to_s
        if j == @max_column-1
          file.printf "\n"
        else file.printf ","
        end
      end
    end

    rescue StandardError => e
    puts e
  ensure
    file.close if file.nil?
  end

end

def test_file

  iniTime = Time.now
  puts "#The initial Time: #{iniTime} "
  m = Mda.new(10000,10000)
  puts  "#{Time.now - iniTime} seconds for creating the matrix}"
  m.fill_array(1,1,"wahahhahah")
  m.fill_array(1,10,"pos 1 10")
  puts  "#{Time.now - iniTime} seconds for FILLING the matrix}"
  m.create_file
  puts  "#{Time.now - iniTime} seconds for creating the file}"

end

end

