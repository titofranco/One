// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// 6.2645966700,-75.5877166080;
// The Javascript Menu and its functions is based on code provided by the
// Community Church Javascript Team
// http://econym.org.uk/gmap/context.htm
// http://econym.org.uk/gmap/
// Arrow function: http://econym.org.uk/gmap/arrows.htm
// Cliente location: http://designshack.co.uk/articles/javascript/detecting-location-using-google-ajax-api
var map;
var bus;
var route;

$(document).ready(function() {
  window.onresize = handleResize;
  handleResize();
  map = new Map();
  google.maps.event.addDomListener(window, 'load', map.initialize());
  bus = new Bus();
  route = Route();

  /* The offsetHeight and offsetWidth properties are provided by the browser,
     and return—in pixels—the dimensions of their element, including any padding.*/
  /* Redimensiona el tamño del mapa y de la barra lateral*/
  function handleResize() {
    var height = windowHeight() - $('#toolbar')[0].offsetHeight - 45;
    $('#map').height(height);
    $('#sidebar').height(height - 18);
  }

  function windowHeight() {
    //Standard browsers (Mozilla,Safari,etc.)
    if (self.innerHeight) return self.innerHeight;
    // IE 6
    if (document.documentElement && document.documentElement.clientHeight) return y = document.documentElement.clientHeight;
    //IE 5
    if (document.body) return document.body.clientHeight;
    //Just in case
    return 0;
  }

});

var Map = function() {

  var self = this;
  var obj;
  var lat;
  var lng;
  //Variables utilizadas para limitar a que se cree sólo un marker
  var countInitial = 0;
  var countFinal = 0;
  var point;
  var startMarker;
  var endMarker;

  self.initialize = initialize;
  self.obj = obj;
  self.startMarker = startMarker;
  self.endMarker = endMarker;
  self.randomColor = randomColor;

  function initialize() {
    obj = new google.maps.Map(document.getElementById('map'),  map_options());
    google.maps.event.addListener(obj, 'rightclick', function(event) {
      // http://googleapitips.blogspot.com/2010/06/how-to-add-context-menu-to-google-maps.html
      showContextMenu(event.latLng);
    });

  }

  function map_options() {
    //6.2201673770;-75.6076627160; Joan's home
    //If ClientLocation was filled in by the loader, use that info instead
    /*if (google.loader.ClientLocation) {
      centerLatitude = google.loader.ClientLocation.latitude;
      centerLongitude = google.loader.ClientLocation.longitude;
      }
    */
    return {
      center: {lat:  6.27488, lng:  -75.56817},
      zoom: 15,
      disableDoubleClickZoom : true
    };
  }

  function showContextMenu(currentLatLng) {
    var projection;
    var contextmenuDir = $('#contextMenu')[0];
    $('#contextMenu').show();
    $(obj.getDiv()).append(contextmenuDir);
    point = currentLatLng;

    setMenuXY(currentLatLng);
    lat = currentLatLng.lat();
    lng = currentLatLng.lng();

    contextmenuDir.style.visibility = "visible";
    google.maps.event.addListener(obj, 'click', function(event) {
      contextmenuDir.style.visibility = "hidden";
    });
  }

  function getCanvasXY(currentLatLng){
    var scale = Math.pow(2, obj.getZoom());
    var nw = new google.maps.LatLng(
      obj.getBounds().getNorthEast().lat(),
      obj.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = obj.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = obj.getProjection().fromLatLngToPoint(currentLatLng);
    var currentLatLngOffset = new google.maps.Point(
      Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
      Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return currentLatLngOffset;
  }

  function setMenuXY(currentLatLng){
    var mapWidth = $('#map').width();
    var mapHeight = $('#map').height();
    var menuWidth = $('#contextMenu').width();
    var menuHeight = $('#contextMenu').height();
    var clickedPosition = getCanvasXY(currentLatLng);
    var x = clickedPosition.x ;
    var y = clickedPosition.y ;

    if((mapWidth - x ) < menuWidth)//if to close to the map border, decrease x position
      x = x - menuWidth;
    if((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
      y = y - menuHeight;

    $('#contextMenu').css('left',x  );
    $('#contextMenu').css('top',y );
  };

  function createIcon(file) {
    // endMarker.setImage({url:'http://googlemapsbook.com/chapter4/StoreLocationMap/ronjonsurfshoplogo.png'});
    var icon = {};
    icon.url = "http://www.google.com/mapfiles/" + file;
    // icon.shadow = "http://www.google.com/mapfiles/shadow50.png";
    icon.size = new google.maps.Size(20, 34);
    icon.origin = new google.maps.Point(0, 0);
    //icon.shadowSize = new google.maps.Size(37, 34);
    icon.anchor = new google.maps.Point(0, 32);
    return icon;
  }

  //Obtiene el punto inicial del field, crea el marker y lo habilita para que se pueda arrastrar
  function getInitialPoint() {
    if (countInitial == 0) {
      createStartMarker();
      fillCoordinates(lat, lng, 0);
      countInitial = 1;
      google.maps.event.addListener(startMarker, "dragend", function () {
        var latitude = startMarker.getPosition().lat();
        var longitude = startMarker.getPosition().lng();
        fillCoordinates(latitude, longitude, 0);
      });
    }
  }

  function createStartMarker() {
    var icon = createIcon("dd-start.png");
    console.log("icon", icon);
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
    };
    startMarker = new google.maps.Marker({
      icon: icon,
      position: point,
      map: obj,
      shape: shape,
      draggable: true
    });
  }

  function startMarker() {
    return startMarker;
  }

  //Obtiene el punto final del field, crea el marker y lo habilita para que se pueda arrastrar
  function getFinalPoint() {
    if (countFinal == 0) {
      createEndMarker();
      fillCoordinates(lat, lng, 1);
      countFinal = 1;
      google.maps.event.addListener(endMarker, "dragend", function () {
        var latitude = endMarker.getPosition().lat();
        var longitude = endMarker.getPosition().lng();
        fillCoordinates(latitude, longitude, 1);
      });
    }
  }

  function createEndMarker() {
    var icon = createIcon("dd-end.png");
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
    };
    endMarker = new google.maps.Marker({
      draggable: true,
      icon: icon,
      map: obj,
      position: point,
      shape: shape
    });
  }

  function endMarker() {
    return endMarker;
  }

  function fillCoordinates(lat, lng, pos) {
    var latitude = String(lat).substring(0, 7);
    var longitude = String(lng).substring(0, 9);
    var value = latitude + "," + longitude;
    pos === 0 ? $("#start_point").val(value) : $("#end_point").val(value);
  }

  //Borra todos los overlays del mapa, es decir, la ruta,los markers, las flechas.
  function clearMarkers() {
    obj.clearOverlays();
    countInitial = 0;
    countFinal = 0;
    $("#start_point").val('');
    $("#end_point").val('');
    $("#contextMenu").hide();
  }

  $('#setStartPoint').on('click', function() {
    getInitialPoint();
    $("#contextMenu").hide();
  });

  $('#setEndPoint').on('click', function () {
    getFinalPoint();
    $("#contextMenu").hide();
  });

  //Aumenta el zoom al mapa
  $('#zoomIn').on('click', function () {
    obj.zoomIn();
    $("#contextMenu").hide();
  });

  $('#zoomOut').on('click', function () {
    obj.zoomOut();
    $("#contextMenu").hide();
  });

  $('#centerMap').on('click', function () {
    obj.setCenter(point);
  });

  $('#clearMarkers').on('click', function () {
    clearMarkers();
  });

  $("#form").submit(function(event) {
    event.preventDefault();
    if($(".start_point").val() == "" || $(".end_point").val() == "") {
      alert("Debe elegir punto inicial y punto final");
      return false;
    }
    findRoute();
    return false;
  });

  //Metodo que hace la llamada asincrona al controlador, pasando los parametros
  //correspondientes y evaluando la respuesta dada por este
  function findRoute() {

    var startLatLng = startMarker.getPosition().lat() + "," + startMarker.getPosition().lng();
    var endLatLng = endMarker.getPosition().lat() + "," + endMarker.getPosition().lng();
    $.get('map/find_route', {start_point: startLatLng, end_point: endLatLng})
      .done(function (data) {
        clearExistingOverlays();
        route.initialize(data.content, data.route_explain);
        findBusRoute();
      })
      .fail(function (data){
        alert(data.content);
        //Si se hace de nuevo una peticion y hay error entonces esconder panel
        $('#explain').show();
        $('#sidebar').hide();
      });
  }

  function findBusRoute() {
    var roadmap_id = route.obj()[0].roadmap_id + "," + route.obj()[route.objSize()-1].roadmap_id;
    $.get('map/find_bus_route', {roadmap_id: roadmap_id})
      .done(function (data) {
          bus.initialize(data.bus, data.bus_explain);
      })
    .fail(function (data) {
      $('#sidebar-bus-list').hide();
    });
  }

  function randomColor() {
    var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    while(color.length <= 6) {
      color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    return color;
  }

  //Se eliminar los overlays existentes, en caso tal se haga otro llamado al controlador
  function clearExistingOverlays() {
    route.clearOverlays();
    bus.clearOverlays();
  }

  function obj() {
    return obj;
  }

  return self;
};

//Obtenido de http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
//Método para obtener el tamaño de un hash
Object.size = function (obj) {
  var size = 0,key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};


//Valida y si todo está correcto, procede a hacer la llama asincrona al server
//function validar(form) {
//    var validate = checkform(form);
//    if (validate) {
//   }
//}

//Valida que los campos no estén vacios
/*
  function checkform(form) {
  if (form.initial_point.value == "" && form.end_point.value == "") {
  alert("Debe elegir punto inicial y punto final");
  return false;
  } else if (form.initial_point.value == null || form.initial_point.value == "") {
  form.initial_point.focus();
  alert("Debe elegir un punto inicial");
  return false;
  } else if (form.end_point.value == null || form.end_point.value == "") {
  form.end_point.focus();
  alert("Debe elegir un punto final");
  return false;
  }
  return true;
  }
*/

//}
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker
