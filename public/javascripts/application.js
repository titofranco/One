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

var infoRouteHash={};
var buses_hash={};
var map;

var polyline;
var selected_polyline;
var polyline_metro;
var polyline_bus;

var latlng_street;
var latlng_bus;
var latlng_metro;
var init_lat;
var init_lng;
var end_lat;
var end_lng;

var current_sb_item=false;
var arrow_marker;
var initial_marker;
var final_marker;
var route_marker;


/*Funcion para obtener el tamaño de la ventana*/
function windowHeight(){
  //Standard browsers (Mozilla,Safari,etc.)
  if(self.innerHeight)
     return self.innerHeight;
  // IE 6
  if(document.documentElement && document.documentElement.clientHeight)
     return y = document.documentElement.clientHeight;
  //IE 5
  if(document.body)
     return document.body.clientHeight;
  //Just in case
  return 0;
}

/* The offsetHeight and offsetWidth properties are provided by the browser, and return—in
   pixels—the dimensions of their element, including any padding.*/
/*Redimensiona el tamño del mapa y de la barra lateral*/
function handleResize(){
  var height = windowHeight()- document.getElementById('toolbar').offsetHeight-45;
  document.getElementById('map').style.height = height + 'px';
  document.getElementById('sidebar').style.height = (height-18) + 'px';
}

/*Pinta el trayecto seleccionado en sidebar, crea el marker y pinta una flecha
dependiento hacia donde se debe girar*/
function focusPoint(id){
  //Pinta de nuevo toda la ruta y el trayecto seleccionado en sidebar
  map.addOverlay(polyline);
  if(selected_polyline){map.removeOverlay(selected_polyline);}
  selected_polyline = new GPolyline(
                     [new GLatLng(infoRouteHash[id].lat_start,infoRouteHash[id].long_start),
                      new GLatLng(infoRouteHash[id].lat_end,infoRouteHash[id].long_end)]
                      ,'#FFFFFF',4,0.8);
  map.addOverlay(selected_polyline);

  //Pinta una flecha verde, para indicar la posición elegida en sidebar
  var current_loc_icon = new GIcon();
  current_loc_icon.image = "http://maps.google.com/mapfiles/arrow.png";
  current_loc_icon.shadow = "http://maps.google.com/mapfiles/arrowshadow.png";
  current_loc_icon.iconAnchor = new GPoint(9,34);
  current_loc_icon.shadowSize = new GSize(37,34);

  //Si el marker existe entonces hay que quitarlo del mapa
  if(route_marker != null){
    map.removeOverlay(route_marker);
  }
  var latlng_current_loc = new GLatLng(infoRouteHash[id].lat_start,infoRouteHash[id].long_start);
  route_marker = new GMarker(latlng_current_loc,{icon:current_loc_icon});
  map.panTo(latlng_current_loc);
  map.addOverlay(route_marker);

  addClassSidebar('#sidebar-item-',id);
  midArrows(id);

}

//Cambia el CSS del sidebar-item-id cuando se hace clic sobre este
function addClassSidebar(element,id){
  if($(element+''+current_sb_item).hasClass('current')){
    $(element+''+current_sb_item).removeClass('current');
  } $(element+''+id).addClass('current');
    current_sb_item=id;
}

//Enfoca la linea del metro cuando se hace clic sobre el sidebar-item-id correspondiente
function focusMetro(id_metro_related){
  var size = Object.size(infoRouteHash);
  var selected_station=[];
  map.addOverlay(polyline);

  for(var i=0;i<size;i++){
    if(infoRouteHash[i].related_id==id_metro_related){
       selected_station.push(new GLatLng(infoRouteHash[i].lat_start,infoRouteHash[i].long_start));
       selected_station.push(new GLatLng(infoRouteHash[i].lat_end,infoRouteHash[i].long_end));
    }
  }

  var polyline_metro=new GPolyline(selected_station);
  map.addOverlay(polyline_metro);
}


//Funcion que dibuja triangulos hacia la dirección que se va.
function midArrows(id) {
  if(arrow_marker){
    map.removeOverlay(arrow_marker);
  }
  arrowIcon = new GIcon();
  arrowIcon.iconSize = new GSize(24,24);
  arrowIcon.shadowSize = new GSize(1,1);
  arrowIcon.iconAnchor = new GPoint(12,12);
  arrowIcon.infoWindowAnchor = new GPoint(0,0);

  //Pintar la flecha de la próxima dirección
  if(infoRouteHash[id+1]){
    // == round it to a multiple of 3 and cast out 120s
    var dir = Math.round(infoRouteHash[id+1].bearing/3) * 3;
    while (dir >= 120) {dir -= 120;}
  }
  // == use the corresponding triangle marker
  arrowIcon.image = "http://www.google.com/intl/en_ALL/mapfiles/dir_"+dir+".png";
  arrow_marker= new GMarker(
  new GLatLng(infoRouteHash[id].lat_end,infoRouteHash[id].long_end),arrowIcon)
  map.addOverlay(arrow_marker);
}

//Función que pinta la ruta de buses, la de vias y la del metro
function drawPolyline(latlng_bus,latlng_street,latlng_metro){
  console.debug("el tamaño del array " + latlng_street.length);
  polyline = new GPolyline(latlng_street,'#FF6633',6,1);
  map.addOverlay(polyline);
  polyline_metro = new GPolyline(latlng_metro,'#D0B132',6,1);
  map.addOverlay(polyline_metro);
}

//Random colors: http://paulirish.com/2009/random-hex-color-code-snippets/
//Función de prueba para pintar varias rutas de buses
function drawPolyline_bus(buses_hash){
  var array =[];
  var size=Object.size(buses_hash);
  for (var i=0;i<size-1;i++){
    if(buses_hash[i].id == buses_hash[i+1].id){
      array.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
    }
    else {
      var color='#'+Math.floor(Math.random()*16777215).toString(16);
      var polyline_bus = new GPolyline(array,color,6,0.8);
      map.addOverlay(polyline_bus);
      array=[];
    }
  }
}

//Función para pintar sólo una ruta de bus
function drawSelectedPolyline_bus(id){
  var array =[];
  var size=Object.size(buses_hash);
  for (var i=0;i<size-1;i++){
    if(id == buses_hash[i].id){
     array.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
    }
  }
  if(polyline_bus){map.removeOverlay(polyline_bus);}
  var color='#'+Math.floor(Math.random()*16777215).toString(16);
  polyline_bus = new GPolyline(array,color,6,0.8);
  map.addOverlay(polyline_bus);
  array=[];
  // Se agrega 99999 para diferenciarlos de los <li id> de la ruta
  addClassSidebar('#sidebar-item-',(id+99999));
}

//Valida y si todo está correcto, procede a hacer la llama asincrona al server
function validar(form){
  var validate = checkform(form);
  if(validate) {
    findRoute();
    findBus();
  }
}

//Valida que los campos no estén vacios
function checkform(form){
  if(form.initial_point.value=="" && form.end_point.value==""){
    alert("Debe elegir punto inicial y punto final");
  return false;
  }
  else if(form.initial_point.value==null || form.initial_point.value==""){
    form.initial_point.focus();
    alert("Debe elegir un punto inicial");
  return false;
  }
  else if(form.end_point.value==null || form.end_point.value==""){
    form.end_point.focus();
    alert("Debe elegir un punto final");
  return false;
  }
  return true;
}


$(document).ready(function(){
 handleResize();
 if(GBrowserIsCompatible){
  //6.2201673770;-75.6076627160; casa de joan
  var centerLatitude =  6.277413845000;
  var centerLongitude = -75.589492305;
  var startZoom = 14;
  var lat;
  var lng;
  //Variables utilizadas para limitar a que se cree sólo un marker
  var countInitial=0;
  var countFinal=0;
  var point;
  var divheader=document.getElementById("inputBoxes");

  map = new GMap2(document.getElementById("map"));

  //If ClientLocation was filled in by the loader, use that info instead
/*if (google.loader.ClientLocation) {
    centerLatitude = google.loader.ClientLocation.latitude;
    centerLongitude = google.loader.ClientLocation.longitude;
  }
*/
  map.setCenter(new GLatLng(centerLatitude,centerLongitude),17);
  map.setMapType(G_HYBRID_MAP);
  map.setUIToDefault();

  var inputForm = document.createElement("form");
  inputForm.setAttribute("action","");
  inputForm.id='input_points';
  inputForm.onsubmit = function(){validar(this);return false;};
  inputForm.innerHTML=
    '<div id=inputArea>'
    +'<img src="http://www.google.com/mapfiles/dd-start.png" class="icon"/>'
    + '<label for="initial_point">Origen</label>'
    + '<input type="text" id="initial_point" value="" name="initial_point" style="width:120px;" readonly="readonly"/>'
    + '<p> <img src="http://www.google.com/mapfiles/dd-end.png" class="icon"/>'
    + '<label for="end_point">Destino</label>'
    + '<input type="text" id="end_point" value="" name="end_point" style="width:120px;" readonly="readonly"/>'
    + '<label>&nbsp;</label><input type="submit" class="button" value="Mostrar ruta!"/>'
    + '</div>';
  divheader.appendChild(inputForm);

  //Se crea el menu desplegable que se crea cuando se hace click derecho sobre el mapa
  var contextmenu = document.createElement("div");
  contextmenu.style.visibility="hidden";
  contextmenu.style.background="#ffffff";
  contextmenu.style.border="1px solid #8888FF";
  contextmenu.innerHTML =
    '<a href="javascript:void(0)"  id="initial_point_func"><div class="context">Ruta desde aquí</div></a>'
    +'<a href="javascript:void(0)" id="end_point_func"><div class="context">Ruta hasta aquí</div></a>'
    +'<hr>'
    +'<a href="javascript:void(0)" id="zoomin_func"><div class="context">Zoom In</div></a>'
    +'<a href="javascript:void(0)" id="zoomout_func"><div class="context">Zoom Out</div></a>'
    +'<a href="javascript:void(0)" id="centerMap_func"><div class="context">Centrar mapa</div></a>'
    +'<hr>'
    +'<a href="javascript:void(0)" id="clearMarkers_func"><div class="context">Reiniciar origen/destino </div></a>'
  map.getContainer().appendChild(contextmenu);

  document.getElementById('initial_point_func').onclick=function(){getInitialPoint();return false;};
  document.getElementById('end_point_func').onclick=function(){getFinalPoint();return false;};
  document.getElementById('zoomin_func').onclick=function(){zoomIn();return false;};
  document.getElementById('zoomout_func').onclick=function(){zoomOut();return false;};
  document.getElementById('centerMap_func').onclick=function(){setCenter();return false;};
  document.getElementById('clearMarkers_func').onclick=function(){clearMarkers();return false;};

  //Evento para desplegar menú cuando se hace click izquierdo
  GEvent.addListener(map,"singlerightclick",function(pixel,tile) {
    // store the "pixel" info in case we need it later
    // adjust the context menu location if near an egde
    // create a GControlPosition
    // apply it to the context menu, and make the context menu visible
    var clickedPixel = pixel;
    var x=pixel.x;
    var y=pixel.y;

    if (x > map.getSize().width - 120) { x = map.getSize().width - 120 }
    if (y > map.getSize().height - 100) { y = map.getSize().height - 100 }
    var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(x,y));
    pos.apply(contextmenu);
    contextmenu.style.visibility = "visible";
    point=map.fromContainerPixelToLatLng(clickedPixel);
    lat=point.lat();
    lng=point.lng();

  });

  //Obtiene el punto inicial del field, crea el marker y lo habilita para que se pueda arrastrar
  function getInitialPoint() {
    if(countInitial==0){
      initial_marker = new GMarker(point,{draggable:true});
      var init_icon = new GIcon();
      init_icon.image = "http://www.google.com/mapfiles/dd-start.png";
      init_icon.shadow = "http://www.google.com/mapfiles/shadow50.png";
      init_icon.iconSize = new GSize(20,34);
      init_icon.iconAnchor = new GPoint(9,34);
      init_icon.shadowSize = new GSize(37, 34);
      init_icon.infoWindowAnchor = new GPoint(24,24);
      initial_marker = new GMarker(point,{draggable:true,icon:init_icon});
      map.addOverlay(initial_marker);
      //marker.setLatLng(new GLatLng(6.256648053,-75.602324565));
      init_lat=lat;
      init_lng=lng;
      document.getElementById("initial_point").value=String(lat).substring(0,7)+','+String(lng).substring(0,9);
      contextmenu.style.visibility="hidden";
      countInitial=1;

      GEvent.addListener(initial_marker, "dragend", function() {
      init_lat=initial_marker.getPoint().lat();
      init_lng=initial_marker.getPoint().lng();
      document.getElementById("initial_point").value=String(init_lat).substring(0,7)+","+ String(init_lng).substring(0,9);
      });
    }
  }

  //Obtiene el punto final del field, crea el marker y lo habilita para que se pueda arrastrar
  function getFinalPoint() {
    if(countFinal==0){
      var final_icon = new GIcon();
      final_icon.image = "http://www.google.com/mapfiles/dd-end.png";
      final_icon.shadow = "http://www.google.com/mapfiles/shadow50.png";
      final_icon.iconSize = new GSize(20,34);
      final_icon.iconAnchor = new GPoint(9,34);
      final_icon.shadowSize = new GSize(37, 34);
      final_icon.infoWindowAnchor = new GPoint(24,24);
      final_marker = new GMarker(point,{draggable:true,icon:final_icon});
     // final_marker.setImage({url:'http://googlemapsbook.com/chapter4/StoreLocationMap/ronjonsurfshoplogo.png'});
      map.addOverlay(final_marker);
      end_lat=lat;
      end_lng=lng;
      document.getElementById("end_point").value=String(lat).substring(0,7)+','+String(lng).substring(0,9);
      contextmenu.style.visibility="hidden";
      countFinal=1;

      GEvent.addListener(final_marker, "dragend", function() {
       end_lat=final_marker.getPoint().lat();
       end_lng=final_marker.getPoint().lng();
       document.getElementById("end_point").value=String(end_lat).substring(0,7)+","+ String(end_lng).substring(0,9);
      });
    }
  }

  //Aumenta el zoom al mapa
  function zoomIn() {
    map.zoomIn();
    contextmenu.style.visibility="hidden";
  }

  //Disminuye el zoom al mapa
  function zoomOut() {
    map.zoomOut();
    contextmenu.style.visibility="hidden";
  }

  //Centra el mapa
  function setCenter(){
      map.setCenter(point);
  }

  //Borra todos los overlays del mapa, es decir, la ruta,los markers, las flechas.
  function clearMarkers(){
    map.clearOverlays();
    document.getElementById("initial_point").value='';
    document.getElementById("end_point").value='';
    countInitial=0;
    countFinal=0;
    contextmenu.style.visibility="hidden";
  }

  //Funcion para que se no muestre el menu desplegable si se hace click en otra parte del mapa
  GEvent.addListener(map,'click',function(overlay,latlng) {
    contextmenu.style.visibility="hidden";
  });

 }else{
   alert("Your Browser Is Not Compatible")
  }
});

//Este metodo es para asignar la lat-lng más cercana al marker a el initial_marker y al final_marker
function setLatLngMarkers(lat_start,long_start,lat_end,long_end){
  initial_marker.setLatLng(new GLatLng(lat_start,long_start));
  final_marker.setLatLng(new GLatLng(lat_end,long_end));
}


//Metodo que hace la llamada asincrona al controlador, pasando los parametros
//correspondientes y evaluando la respuesta dada por este
function findRoute(){
  var init_lat_lng = init_lat+","+init_lng;
  var end_lat_lng = end_lat+ "," + end_lng;
  var getVars = "?initial_point="+init_lat_lng+"&end_point="+end_lat_lng;

  var request = GXmlHttp.create();
  request.open('GET', 'calcular'+getVars,true);
  request.onreadystatechange = function() {
    if(request.readyState == 4){

       var success=false;
       var content="Error contacting web service";
       try{
           res=eval("(" + request.responseText + ")" );
           content=res.content;
           success=res.success;
       }catch (e){
        success=false;
       }
       if(!success) {alert(content);}
       else{
         parseContent(content);
       }
    }
  }
  request.send(null);
  return false;
}

//Hace la llamada asincrona al servidor para obtener las rutas de buses que son más cercanas a la ruta
//entrega en el metodo findRoute()
function findBus(){
  var request = GXmlHttp.create();
  request.open('GET', 'findRouteBuses',true);
  request.onreadystatechange = function() {
    if(request.readyState == 4){
       var success=false;
       var content="Error contacting web service";
       try{
           res=eval("(" + request.responseText + ")" );
           content=res.content;
           success=res.success;
       }catch (e){
        success=false;
       }
       if(!success) {alert(content);}
       else{
         parseContentBuses(content);
       }
    }
  }
  request.send(null);
  return false;
}

//La respuesta entrega por map controler es puesta en buses_hash y llama el metodo
//addOptimalBusesRoutes para que a cada ruta de bus se le cree un elemento en el panel derecho
function parseContentBuses(content){
  buses_hash={};
  var size=content.length;
  for(var i=0; i<size;i++){
    var id = content[i].id;
    var lat_start = content[i].lat_start;
    var long_start = content[i].long_start;
    buses_hash[i]={id:id,lat_start:lat_start,long_start:long_start}
  }
  //Agrego este ultimo registro falso, ya que debo recorrer el arreglo y comparar el siguiente id del bus
  buses_hash[size]={id:99999,lat_start:content[size-1].lat_start ,long_start:content[size-1].long_start};
  addOptimalBusesRoutes(buses_hash);
  //drawPolyline_bus(buses_hash);
}

//Obtiene el resultado enviado por el controlador, lo pone en un hash, luego llama al metodo
//drawPolyline para pintar la ruta
function parseContent(content){

  infoRouteHash={};
  latlng_street=[];
  latlng_metro=[];
  last=content.length;

  for(var i=0;i<content.length;i++){
    var id = content[i].id;
    var lat_start=content[i].lat_start;
    var long_start=content[i].long_start;
    var lat_end=content[i].lat_end;
    var long_end=content[i].long_end;
    var stretch_type=content[i].stretch_type;
    var way_type_a=content[i].way_type_a;
    var street_name_a=content[i].street_name_a;
    var prefix_a=content[i].prefix_a;
    var common_name_a=content[i].common_name_a;
    var distance=String(content[i].distance).substring(0,5);
    var label_a=content[i].label_a;
    var way_type_b=content[i].way_type_b;
    var street_name_b=content[i].street_name_b;
    var prefix_b=content[i].prefix_b;
    var label_b=content[i].label_b;
    var common_name_b=content[i].common_name_b;
    var bearing=getBearing(lat_start,long_start,lat_end,long_end);
    var direction = getDirection(bearing);

    infoRouteHash[i]={
      id:id,
      lat_start:lat_start,
      long_start:long_start,
      lat_end:lat_end,
      long_end:long_end,
      stretch_type:stretch_type,
      way_type_a:way_type_a,
      street_name_a:street_name_a,
      prefix_a:prefix_a,
      common_name_a:common_name_a,
      distance:distance,
      label_a:label_a,
      way_type_b:way_type_b,
      street_name_b:street_name_b,
      prefix_b:prefix_b,
      label_b:label_b,
      common_name_b:common_name_b,
      bearing:bearing,
      direction:direction,
      related_id:'0'
    };

    if(stretch_type=='3'){
      id_metro_related=id;
      infoRouteHash[i].related_id=id_metro_related;
    }
    if(stretch_type=='2'){
      infoRouteHash[i].related_id=id_metro_related;
    }

    console.debug("\ni: "+i+ " el ID: " + id + " INIT: " + lat_start+"," + long_start + " END: " + lat_end + "," + long_end +
    " BEARING: " + bearing + " DIRECTION: " + direction  + " STREET_NAME_A: " + way_type_a + street_name_a +
    " COMMON_A: " +common_name_a+ " STREET_NAME_B: "+ way_type_b + street_name_b + " STRETCH_TYPE: " + stretch_type+
    " COMMON_B: " +common_name_b + " RELATED " +infoRouteHash[i].related_id + " DISTANCE: " + distance);
    //Se pone en este array todas las coordenadas que se van a pintar
    latlng_street.push(new GLatLng(lat_start,long_start));
    if(parseInt(stretch_type) >= 2){latlng_metro.push(new GLatLng(lat_start,long_start));}
  }
  //Se adiciona el ulitmo trayecto
  latlng_street.push(new GLatLng(lat_end,long_end));

  //Se eliminar los overlays existentes, en caso tal se haga otro llamado al controlador
  clearExistingOverlays();

  setLatLngMarkers(infoRouteHash[0].lat_start,infoRouteHash[0].long_start, infoRouteHash[last-1].lat_end, infoRouteHash[last-1].long_end);
  drawPolyline(latlng_bus,latlng_street,latlng_metro);
  explainRoute(infoRouteHash);
}

//Elimina todos los overlays existentes en el mapa
function clearExistingOverlays(){
  if(polyline_metro){map.removeOverlay(polyline_metro);}
  if(polyline){ map.removeOverlay(polyline);}
  if(selected_polyline){map.removeOverlay(selected_polyline);}
  if(route_marker){map.removeOverlay(route_marker);}
  if(arrow_marker){map.removeOverlay(arrow_marker);}

}

//Adiciona el li correspondiente a cada ruta de bus al panel derecho (sidebar)
function addOptimalBusesRoutes(buses_hash){
  var explain_='';
  var size = Object.size(buses_hash);
  for(var i=0;i<size-1;i++){
    if(buses_hash[i].id != buses_hash[i+1].id){
      // Se agrega 99999 para diferenciarlos de los <li id> de la ruta
      explain_ += '<li id=sidebar-item-'+(buses_hash[i].id+99999)+' >'+
                  '<a href="#" onclick="javascript:drawSelectedPolyline_bus('+buses_hash[i].id+')">'+
                  "Ruta numero " + buses_hash[i].id + "</a></li>";
    }
  }
  var div_sidebar_bus_list = document.getElementById("sidebar-bus-list");
  div_sidebar_bus_list.innerHTML=explain_;
}

//Explica la ruta a tomar y la pone en el panel derecho (sidebar)
function explainRoute(infoRouteHash){
  var continueStraight=false;
  var size = Object.size(infoRouteHash);
  var explain;
  var turn;
  var first_node=true;
  var estacion_metro=false;
  //console.debug("El tamaño del hash: " + size);
  var j=1;
  for(var i=0;i<size-1;i++){

    if(first_node){
      explain = '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
      j + ". " + "Dirigete en dirección <b>" + infoRouteHash[i].direction + "</b> hacia la "
      +"<b>"+ infoRouteHash[i].way_type_b +  " " +
       infoRouteHash[i].street_name_b +  " (metros:" + infoRouteHash[i].distance + ")" + "</b></a></li>";
       first_node=false;
    }
    else if((infoRouteHash[i-1].direction==infoRouteHash[i].direction) && continueStraight==false && infoRouteHash[i].stretch_type=='1'){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
      j + ". " + "Sigue derecho en dirección: <b> " + infoRouteHash[i].direction + "</b> por la: " +
      "<b>"+ infoRouteHash[i].way_type_b +  " " +
      infoRouteHash[i].street_name_b + " (metros:" + infoRouteHash[i].distance + ")" +"</b></a></li>" ;

      if(infoRouteHash[i].direction==infoRouteHash[i+1].direction)
      continueStraight=true;
    }
    else if(continueStraight==true && (infoRouteHash[i-1].direction==infoRouteHash[i].direction) && infoRouteHash[i].stretch_type=='1'){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(i)+')">' +
      j + ". " + "Continúa por: " + "<b>"+ infoRouteHash[i].way_type_b +  " " +
      infoRouteHash[i].street_name_b + " (metros:" + infoRouteHash[i].distance + ")" +"</b></a></li>" ;
    }
    /*else if(infoRouteHash[i-1].stretch_type=='1' && infoRouteHash[i].stretch_type=='4'){
      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
      "Dirigete hacia el <b>" + infoRouteHash[i].street_name_a + "</b></a></li>" ;
    }*/
    else if ( (infoRouteHash[i-1].direction != infoRouteHash[i].direction) && infoRouteHash[i].stretch_type=='1'){
      turn = eval_direction(infoRouteHash[i-1].direction,infoRouteHash[i].direction)

      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(i)+')">' +
      j + ". " +"Voltear " + "<b>"+ turn+"</b>" + " por " +
      "<b>"+ infoRouteHash[i].way_type_b +  " " +
      infoRouteHash[i].street_name_b + " (metros:" + infoRouteHash[i].distance + ")" +"</b></a></li>";
      continueStraight = false;
    }
    else if(infoRouteHash[i-1].stretch_type=='4' && infoRouteHash[i].stretch_type=='3'){
      //alert("metro true");
      estacion_metro=true;
    }
    else if((infoRouteHash[i-1].stretch_type=='3' && infoRouteHash[i].stretch_type=='2') && estacion_metro==true){
      alert("hola hola");
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusMetro('+infoRouteHash[i-1].related_id+')">'
      j + ". " + 'Ve de la estación <b> ' + infoRouteHash[i-1].common_name_a +
      " (metros:" + infoRouteHash[i].distance + ")" + '</b>';
      //console.debug("hola 1 " + explain );
    }
    else if(estacion_metro==true && (infoRouteHash[i-1].stretch_type=='2' && infoRouteHash[i].stretch_type=='3')) {
      explain += ' hasta la estación <b>'+infoRouteHash[i].common_name_a+'</b></a></li>';
      //console.debug("hola 2 " + explain);
    }
    else if(infoRouteHash[i-1].stretch_type=='3' && infoRouteHash[i].stretch_type=='4'){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
      j + ". " + 'Baja de la estación ' + infoRouteHash[i-1].common_name_a +
      " dirigete por el <b>"+ infoRouteHash[i].common_name_b +  " " +
      infoRouteHash[i].street_name_a + " (metros:" + infoRouteHash[i].distance + ")" + "</b></a></li>";
      estacion_metro=false;
    }
    j++;
  }
  if(size>1){
  var end;

  if(infoRouteHash[size-2].direction==infoRouteHash[size-1].direction){
    end=j + ". " +'Continúa hasta encontrar tu lugar de destino' +"<b> (" + infoRouteHash[i].distance + ")m</b>";
  }
  else {
    turn = eval_direction(infoRouteHash[size-2].direction,infoRouteHash[size-1].direction)
    end = j + ". " + 'Voltea <b> '+ turn +'</b> hasta llegar a tu lugar destino </b>' +
    "<b> (" + infoRouteHash[i].distance + ")m</b>" ;
  }
  explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(size-1)+')"> '+end+'</a></li>';
  }
  //console.debug("La respuesta de direccion \n: " + explain);
  var div_sidebar_list = document.getElementById("sidebar-list");
  div_sidebar_list.innerHTML=explain;

}

//Obtenido de http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
//Método para obtener el tamaño de un hash
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//}window.onload=init;
//Si el usuario redimensiona la página, el mapa y otros elementos se deben redimensionar
window.onresize = handleResize;
window.onload=handleResize;
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker

