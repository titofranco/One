class Haversine

  TO_RAD=(Math::PI/180)

  def distanceHarvesine(lat1,long1,lat2,long2)

    dLong = long2 - long1
    dLat  = lat2 - lat1

    dLongRad = dLong*TO_RAD
    dLatRad  = dLat*TO_RAD
    lat1Rad  = lat1*TO_RAD
    lat2Rad  = lat2*TO_RAD
    long1Rad = long1*TO_RAD
    long2Rad = long2*TO_RAD

    a =(Math.sin(dLatRad/2))**2 + Math.cos(lat1Rad)*Math.cos(lat2Rad)*(Math.sin(dLongRad/2))**2
    c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    distanceMeters = c*6371000

    return distanceMeters

  end


  def test_haversine
    long1 = -75.586799823
    lat1 = 6.263516533

    long2 = -75.565172439
    lat2 = 6.26603516

    puts distanceHarvesine(lat1,long1,lat2, long2)
  end

end

#h = Haversine.new
#h.test_haversine

