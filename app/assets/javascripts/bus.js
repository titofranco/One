var Bus = function() {

  var self = this;
  var obj;
  var overlay;

  self.initialize = initialize;
  self.clearOverlays = clearOverlays;
  self.obj = obj;

  function initialize(route, explanation) {
    overlay = [];
    obj = route;
    $('#sidebar-bus-list').show();
    $("#sidebar-bus-list").html(explanation);
    createOverlays();
  }

  //Se crean todos los overlays para los buses y se crean datos especificos de cada
  //ruta de bus. initLatLng y endLatLng es la lat-lng inicial y final de la poliline
  //initMarker y endMarker  son los iconos de los buses que indican el inicio
  //y el fin de la ruta de bus
  function createOverlays() {
    var latLng = [];
    for(var i = 0; i < Object.size(obj) - 1; i++){
      if(obj[i].bus_id == obj[i+1].bus_id) {
        latLng.push(new google.maps.LatLng(obj[i].lat_start, obj[i].long_start));
      }
      else {
        latLng.push(new google.maps.LatLng(obj[i].lat_start, obj[i].long_start));
        var polyline = new google.maps.Polyline({path: latLng, strokeColor: map.randomColor(), strokeWeight:4, strokeOpacity: 1});
        var markers  = createMarkers(obj[i].bus_id);
        overlay.push ({
          bus_id     : obj[i].bus_id,
          polyline   : polyline,
          initLatLng : markers.initLatLng,
          endLatLng  : markers.endLatLng,
          initMarker : markers.initMarker,
          endMarker  : markers.endMarker
        });
        //Clear array to store next bus coordinates
        latLng = [];
      }
    }
  }

  //Obtiene la posicion del overlay dado el bus_id
  function overlayPosition(bus_id){
    var size = Object.size(overlay);
    var pos;
    for (var i=0; i<size; i++) {
      if (overlay[i].bus_id == bus_id) {
        pos = i;
        break;
      }
    }
    return pos;
  }

  //Crea los markes para el inicio y el fin de la ruta y los retorna para que
  //despues sean almacenados en overlay
  function createMarkers(bus_id) {
    var initLatLng;
    var endLatLng;
    var initMarker;
    var endMarker;
    var icon = createIcon();

    for (var i = 0; i < Object.size(obj); i++) {
      if (bus_id == obj[i].bus_id) {
        initLatLng = new google.maps.LatLng(obj[i].lat_start, obj[i].long_start);
        initMarker = new google.maps.Marker({position: initLatLng, icon: icon, map: map.obj()});
        while (bus_id == obj[i].bus_id) {
          i++;
        }
        endLatLng = new google.maps.LatLng(obj[i-1].lat_end, obj[i-1].long_end);
        endMarker = new google.maps.Marker({position: endLatLng, icon: icon, map: map.obj()});
        //console.debug(" el lat_start " + lat_start + " lat end " + lat_end + " bus_id " + buses[i-1].bus_id);
      }
    }
    return {initLatLng:initLatLng, endLatLng:endLatLng,
            initMarker:initMarker, endMarker:endMarker};
  }

  function createIcon() {
    var icon = {};
    icon.url = "http://www.google.com/mapfiles/ms/micons/bus.png";
    //icon.shadow = "http://www.google.com/mapfiles/ms/micons/bus.shadow.png";
    icon.origin = new google.maps.Point(0, 0);
    icon.anchor = new google.maps.Point(0, 32);
    icon.size = new google.maps.Size(37, 34);
    return icon;
  }


  //Función para pintar sólo una ruta de bus
  $(".sidebar-item-bus input").on('click', function() {
    var bus_id = $(this).data('bus_id');
    renderPolyline(bus_id, "active");
    renderMarkers(bus_id, $(this).parent());
  });

  //Obtiene toda la polilinea de un bus en especifico, además pone su estado en
  //activo o inactivo dependiendo si se pinta o si se elimina del mapa
  function renderPolyline(bus_id, status) {
    var size = Object.size(overlay);
    var polyline;
    for (var i = 0; i < size; i++) {
      if (bus_id == overlay[i].bus_id) {
        polyline = overlay[i].polyline;
        if (status == "active") {
          overlay[i].status = "active";
        } else {
          overlay[i].status = "inactive";
        }
        break;
      }
    }
    polyline.setMap(map.obj());
  }

  function renderMarkers(bus_id, selector) {
    //Obtiene la posicion del overlay para saber donde pintar los iconos de los buses
    var pos = overlayPosition(bus_id);
    if (selector.hasClass("current")) {
      selector.removeClass("current");
      removePolyline(bus_id);
      overlay[pos].initMarker.setMap(null);
      overlay[pos].endMarker.setMap(null);
    } else {
      selector.addClass("current");
      overlay[pos].initMarker.map = map.obj();
      overlay[pos].endMarker.map = map.obj();
    }
  }

  function clearOverlays() {
    var size = Object.size(overlay);
    //Remueve todas las polilineas y markers de rutas de buses activos
    for (var i=0; i<size; i++) {
      if (overlay[i].status == "active") {
        overlay[i].initMarker.setMap(null);
        overlay[i].endMarker.setMap(null);
        removePolyline(overlay[i].bus_id);
      }
    }
  }

  //Remueve la polylinea del bus seleccionada
  function removePolyline(bus_id) {
    var pos = overlayPosition(bus_id);
    var polyline = overlay[pos].polyline;
    polyline.setMap(null);
  }

  function obj() {
    return obj;
  }

  return self;
};
