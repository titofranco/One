// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// 6.2645966700,-75.5877166080;

// The Javascript Menu and its functions is based on code provided by the
// Community Church Javascript Team
// http://www.bisphamchurch.org.uk/
// http://econym.org.uk/gmap/
/*+-------+------------+--------------------+--------------+----------------+--------------+----------------+-----------------+--------------+
| 46216 |      13779 |              17245 | 6.2462726380 | -75.5758657540 | 6.2549021110 | -75.6123003770 | 4139.9967796865 |            1 |
| 46217 |      13779 |              17246 | 6.2462726380 | -75.5758657540 | 6.2549021110 | -75.6123003770 | 4139.9967796865 |            1 |
| 58593 |      17245 |              13779 | 6.2549021110 | -75.6123003770 | 6.2462726380 | -75.5758657540 | 4139.9967796865 |            1 |
| 58599 |      17246 |              13779 | 6.2549021110 | -75.6123003770 | 6.2462726380 | -75.5758657540 | 4139.9967796865 |            1 |
*/
var infoRoute;
var map;
var polyline;
var polyline_metro;
var latlng_street;
var latlng_bus;
var latlng_metro;
var init_lat;
var init_lng;
var end_lat;
var end_lng;
var initial_marker;
var final_marker;
var marker_route;

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
pixels—the dimensions of their element, including any padding.
*/
/*Redimensiona el tamño del mapa y de la barra lateral*/
function handleResize(){
  var height = windowHeight()- document.getElementById('toolbar').offsetHeight-50;
  document.getElementById('map').style.height = height + 'px';
  document.getElementById('sidebar').style.height = height + 'px';
   //document.getElementById('inputBoxes').style.height = height + 'px';
 //document.getElementById('toolbar').style.height = height + 'px';
}

//Got from http://econym.org.uk/gmap/example_arrows.htm
//Funcion que dibuja triangulos hacia la dirección que se va.
function midArrows(arrowIcon) {

  var size = Object.size(infoRoute);

  for (var i=1; i < size; i++) {
    var p1=infoRoute[i-1];
    var p2=infoRoute[i];
    // == round it to a multiple of 3 and cast out 120s
    var dir = Math.round(infoRoute[i].bearing/3) * 3;
    while (dir >= 120) {dir -= 120;}
    // == use the corresponding triangle marker
    arrowIcon.image = "http://www.google.com/intl/en_ALL/mapfiles/dir_"+dir+".png";
    map.addOverlay(new GMarker(
    new GLatLng(infoRoute[i].lat_start,infoRoute[i].long_start),
    arrowIcon));
  }
 }

//Esta funcion debe estar afuera del init porque sino aparece el error
//focusPoint is not defined
function focusPoint(id){
   //Pinta de nuevo toda la ruta
  map.addOverlay(polyline);
  //alert(id);
  var selected_polyline = new GPolyline(
                   [new GLatLng(infoRoute[id].lat_start,infoRoute[id].long_start),
                   new GLatLng(infoRoute[id].lat_end,infoRoute[id].long_end)]
                   ,'#FFFFFF',4,0.8);

  map.addOverlay(selected_polyline);

  var RonJonLogo = new GIcon();
  RonJonLogo.image = "http://google-maps-icons.googlecode.com/files/speedriding.png";
  RonJonLogo.iconSize = new GSize(48,24);
  RonJonLogo.iconAnchor = new GPoint(24,14);
  RonJonLogo.infoWindowAnchor = new GPoint(24,24);

  if(marker_route != null){map.removeOverlay(marker_route);}
  marker_route = new GMarker(new GLatLng(infoRoute[id].lat_start,infoRoute[id].long_start),{draggable:true,icon:RonJonLogo});
  map.addOverlay(marker_route);
}

//Función que pinta la ruta de buses, la de vias y la del metro
function drawpolyline(latlng_bus,latlng_street,latlng_metro){

  console.debug("el tamaño del array " + latlng_street.length);
  var arrowIcon = new GIcon();
  arrowIcon.iconSize = new GSize(24,24);
  arrowIcon.shadowSize = new GSize(1,1);
  arrowIcon.iconAnchor = new GPoint(12,12);
  arrowIcon.infoWindowAnchor = new GPoint(0,0);

  polyline = new GPolyline(latlng_street,'#FF6633',6,1);
  map.addOverlay(polyline);
  polyline_metro = new GPolyline(latlng_metro,'#D0B132',6,1);
  map.addOverlay(polyline_metro);
  //midArrows(arrowIcon);
}

//Valida que los campos no estén vacios
function checkform(form){

  if(form.initial_point.value=="" &&form.end_point.value==""){
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

//Valida y si todo está correcto, procede a hacer la llama asincrona al server
function validar(form){
  var validate = checkform(form);
  if (validate) findRoute();
}

$(document).ready(function(){
 handleResize();
 if(GBrowserIsCompatible){
//6.2201673770;-75.6076627160; casa de joan
  var centerLatitude =  6.256965;
  var centerLongitude = -75.60496;
  var startZoom = 16;
  var lat;
  var lng;
  var countInitial=0;
  var countFinal=0;
  var point;
  var divheader=document.getElementById("inputBoxes");
  var inputForm = document.createElement("form");

  inputForm.setAttribute("action","");
  inputForm.id='input_points';
  inputForm.onsubmit = function(){validar(this);return false;};
 // inputForm.onsubmit = function(){return checkform(this);};
  inputForm.innerHTML=
    '<div id=inputArea>'
    + '<label for="initial_point">Origen</label>'
    + '<input type="text" id="initial_point" name="initial_point" style="width:120px;"/>'
    + '<label for="end_point">Destino</label>'
    + '<input type="text" id="end_point" name="end_point" style="width:120px;"/>'
    + '<label>&nbsp;</label><input type="submit" class="button" value="Mostrar ruta!"/>'
    + '</div>';
  divheader.appendChild(inputForm);

  document.getElementById("initial_point").value='';
  document.getElementById("end_point").value='';
  document.getElementById("initial_point").setAttribute("readonly","readonly");
  document.getElementById("end_point").setAttribute("readonly","readonly");

  map = new GMap2(document.getElementById("map"));
  map.addControl(new GMapTypeControl());
  map.addControl(new GSmallMapControl());
  map.setMapType(G_SATELLITE_MAP);
  map.setCenter(new GLatLng(centerLatitude,centerLongitude),startZoom);

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

  document.getElementById('initial_point_func').onclick=function(){getInitialPoint();return false;};
  document.getElementById('end_point_func').onclick=function(){getFinalPoint();return false;};
  document.getElementById('zoomin_func').onclick=function(){zoomIn();return false;};
  document.getElementById('zoomout_func').onclick=function(){zoomOut();return false;};
  document.getElementById('centerMap_func').onclick=function(){setCenter();return false;};
  document.getElementById('clearMarkers_func').onclick=function(){clearMarkers();return false;};

  //Obtiene el punto inicial del field, crea el marker y lo habilita para que se pueda arrastrar
  function getInitialPoint() {
    if(countInitial==0){
        initial_marker = new GMarker(point,{draggable:true});
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
        var RonJonLogo = new GIcon();
        RonJonLogo.image = "http://google-maps-icons.googlecode.com/files/speedriding.png";
        RonJonLogo.iconSize = new GSize(48,24);
        RonJonLogo.iconAnchor = new GPoint(24,14);
        RonJonLogo.infoWindowAnchor = new GPoint(24,24);
        final_marker = new GMarker(point,{draggable:true,icon:RonJonLogo});
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


  function zoomIn() {
    // perform the requested operation
    map.zoomIn();
    // hide the context menu now that it has been used
    contextmenu.style.visibility="hidden";
  }


  function zoomOut() {
    map.zoomOut();
    contextmenu.style.visibility="hidden";
  }


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
   // Remove one single marker
   /* if(overlay) {
      map.removeOverlay(overlay);
    }*/
    contextmenu.style.visibility="hidden";
  });

 }else{alert("Your Browser Is Not Compatible")}


});


function setLatLngMarkers(lat_start,long_start,lat_end,long_end){
  initial_marker.setLatLng(new GLatLng(lat_start,long_start));
  final_marker.setLatLng(new GLatLng(lat_end,long_end));

}


//Metodo que hace la llamada asincrona al controlador, pasando los parametros
//correspondientes y evaluando la respuesta dada por este
function findRoute(){
  var init_lat_lng = init_lat+","+init_lng;
  var end_lat_lng = end_lat+ "," + end_lng;
  console.debug("CONSTRUIDO " + end_lat_lng);
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

//Obtiene el resultado enviado por el controlador, lo pone en un hash, luego llama la funcion para pintar la ruta
function parseContent(content){

  infoRoute={};
  latlng_bus=[];
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
    var distance=content[i].distance;
    var label_a=content[i].label_a;
    var way_type_b=content[i].way_type_b;
    var street_name_b=content[i].street_name_b;
    var prefix_b=content[i].prefix_b;
    var label_b=content[i].label_b;
    var common_name_b=content[i].common_name_b;
    var bearing=getBearing(lat_start,long_start,lat_end,long_end);
    var direction = getDirection(bearing);

    infoRoute[i]={id:id,
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
      infoRoute[i].related_id=id_metro_related;
    }
    if(stretch_type=='2'){
      infoRoute[i].related_id=id_metro_related;
    }

    console.debug("\ni: "+i+ " el ID: " + id + " INIT: " + lat_start+"," + long_start + " END: " + lat_end + "," + long_end +
    " BEARING: " + bearing + " DIRECTION: " + direction  + " STREET_NAME_A: " + way_type_a + street_name_a +
    " COMMON_A: " +common_name_a+ " STREET_NAME_B: "+ way_type_b + street_name_b + " STRETCH_TYPE: " + stretch_type+
    " COMMON_B: " +common_name_b + " RELATED " +infoRoute[i].related_id + " DISTANCE: " + distance);

    latlng_street.push(new GLatLng(lat_start,long_start));
   // latlng_street.push(new GLatLng(lat_end,long_end));
    if(parseInt(stretch_type) >= 2){latlng_metro.push(new GLatLng(lat_start,long_start));}
  }
  //Se adiciona el ulitmo trayecto
  latlng_street.push(new GLatLng(lat_end,long_end));

  //Si se intenta eliminar un overlay que no está en el mapa se genera error
  if(polyline_metro != null){
    map.removeOverlay(polyline_metro);
  }
  if(polyline !=null){
    map.removeOverlay(polyline);
  }

  setLatLngMarkers(infoRoute[0].lat_start,infoRoute[0].long_start, infoRoute[last-1].lat_end, infoRoute[last-1].long_end);
  drawpolyline(latlng_bus,latlng_street,latlng_metro);
  explainRoute(infoRoute);
}

//Got from http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
//Método para obtener el tamaño de un hash
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//Obtiene los grados que hay entre 2 pares lat-long
function getBearing(lat_start,long_start,lat_end,long_end){

  var toRad=Math.PI/180;
  var lat1 = lat_start*toRad;
  var long1 = long_start*toRad;
  var lat2 = lat_end*toRad;
  var long2 = long_end*toRad;

  var y = (Math.cos(lat1)*Math.sin(lat2))-( Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1))
  var x = Math.sin(long2-long1)*Math.cos(lat2);
  var brng = Math.atan2(x,y)%(2*Math.PI);
  brng  = brng*(180/Math.PI);
  if(brng < 0 ){brng = brng + 360;} //Convertir grados positivos a negativos
  return brng;
}

//Obtiene la cardinalidad dado los grados
function getDirection(bearing){

  var direction;
  if( (bearing >= 0 && bearing <= 22.5) || (bearing>337.5 && bearing<360))
  {direction="Norte"}
  else if (bearing > 22.5 && bearing <= 66.5 ){direction="Noreste"}
  else if (bearing > 66.5 && bearing <= 117 ){direction="Este"}
  else if (bearing > 117 && bearing <= 157.5 ){direction="Sureste"}
  else if (bearing > 157.5 && bearing <= 202.5 ){direction="Sur"}
  else if (bearing > 202.5 && bearing <= 247.5 ){direction="Suroeste"}
  else if (bearing > 247.5 && bearing <= 292.5 ){direction="Oeste"}
  else if (bearing > 292.5 && bearing <=337.5  ){direction="Noroeste"}

  return direction;

}

//Explica la ruta a tomar y la pone en el panel derecho
function explainRoute(infoRoute){
  var continueStraight=false;
  var size = Object.size(infoRoute);
  var explain;
  var turn;
  var first_node=true;
  var estacion_metro=false;
//  console.debug("El tamaño del hash: " + size);

  for(var i=0;i<size-1;i++){

    if(first_node){
      explain = '<li><a href="#" onclick="javascript:focusPoint('+i+')">'+ "Usted está en: " +
      "<b>" + infoRoute[i].way_type_a + " " + infoRoute[i].street_name_a + "</b>" +
      " dirigete en dirección " + infoRoute[i].direction + " hacia la "
      +"<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>";
       first_node=false;
    }
    else if((infoRoute[i-1].direction==infoRoute[i].direction) && continueStraight==false && infoRoute[i].stretch_type=='1'){

       explain += '<li><a href="#" onclick="javascript:focusPoint('+i+')">'+
       "Sigue derecho en dirección: <b> " + infoRoute[i].direction + "</b> por la: " +
       "<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>" ;

       if(infoRoute[i].direction==infoRoute[i+1].direction)
       continueStraight=true;

    }
    else if(continueStraight==true && (infoRoute[i-1].direction==infoRoute[i].direction) && infoRoute[i].stretch_type=='1'){
      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
       "Continua por: " + "<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>" ;
    }
  /*  else if(infoRoute[i-1].stretch_type=='1' && infoRoute[i].stretch_type=='4'){
      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
      "Dirigete hacia el <b>" + infoRoute[i].street_name_a + "</b></a></li>" ;
    }*/

    else if ( (infoRoute[i-1].direction != infoRoute[i].direction) && infoRoute[i].stretch_type=='1'){
      turn = eval_direction(infoRoute[i-1].direction,infoRoute[i].direction)

      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
       "voltear " + "<b>"+ turn+"</b>" + " por " +
       "<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>";
       continueStraight = false;
    }

    else if(infoRoute[i-1].stretch_type=='4' && infoRoute[i].stretch_type=='3'){
      //alert("metro true");
      estacion_metro=true;
    }
    else if((infoRoute[i-1].stretch_type=='3' && infoRoute[i].stretch_type=='2') && estacion_metro==true){
      alert("hola hola");
      explain += '<li><a href="#" onclick="javascript:focusMetro('+infoRoute[i-1].related_id+')">Ve de la estación <b> ' +
      infoRoute[i-1].common_name_a+ '</b>';
      //console.debug("hola 1 " + explain );

    }
    else if(estacion_metro==true && (infoRoute[i-1].stretch_type=='2' && infoRoute[i].stretch_type=='3')) {
      explain += ' hasta la estación <b>'+infoRoute[i].common_name_a+'</b></a></li>';
      //console.debug("hola 2 " + explain);

    }
    else if(infoRoute[i-1].stretch_type=='3' && infoRoute[i].stretch_type=='4'){
      explain += '<li><a href="#" onclick="javascript:focusPoint('+i+')">Baja de la estación ' +
      infoRoute[i-1].common_name_a + " dirigete por el <b>"+ infoRoute[i].common_name_b +  " " + infoRoute[i].street_name_a + "</b></a></li>";
      estacion_metro=false;
    }

  }
  if(size>1){
  var end;

  if(infoRoute[size-2].direction==infoRoute[size-1].direction){
    end='Continua hasta encontrar tu lugar de destino';
  }
  else {
    turn = eval_direction(infoRoute[size-2].direction,infoRoute[size-1].direction)
    end = 'Voltea <b> '+ turn +'</b> hasta llegar a su lugar destino </b>';
  }
  explain += '<li><a href="#" onclick="javascript:focusPoint('+(size-1)+')"> '+end+'</a></li>';
  }
 // console.debug("La respuesta de direccion \n: " + explain);
  var div_sidebar_list = document.getElementById("sidebar-list");
  div_sidebar_list.innerHTML=explain;

}

function focusMetro(id_metro_related){
  var size = Object.size(infoRoute);
  var selected_station=[];
  map.addOverlay(polyline);

  for(var i=0;i<size;i++){
    if(infoRoute[i].related_id==id_metro_related){
       selected_station.push(new GLatLng(infoRoute[i].lat_start,infoRoute[i].long_start));
       selected_station.push(new GLatLng(infoRoute[i].lat_end,infoRoute[i].long_end));
      // console.debug("el id " + id_metro_related + " INIT: " + infoRoute[i].lat_start+","+infoRoute[i].long_start+
      // " END: " + infoRoute[i].lat_end+","+infoRoute[i].long_end);
    }
  }

  var polyline_metro=new GPolyline(selected_station);
  map.addOverlay(polyline_metro);
}
/*FUNCIONES PARA SABER QUE DIRECCION DEBO TOMAR DADO 2 PUNTOS CARDINALES*/

function eval_direction(comes_from, goes_to){

var tell;

  if(comes_from == "Norte"){
    tell=where_to_turn_n(goes_to);
  }
  else if(comes_from == "Sur"){
    tell=where_to_turn_s(goes_to);
  }
  else if(comes_from == "Este"){
    tell=where_to_turn_e(goes_to);
  }
  else if(comes_from == "Oeste"){
    tell=where_to_turn_w(goes_to);
  }
  else if(comes_from == "Noreste"){
    tell=where_to_turn_ne(goes_to);
  }
  else if(comes_from == "Noroeste"){
    tell=where_to_turn_nw(goes_to);
  }
  else if(comes_from == "Sureste"){
    tell=where_to_turn_se(goes_to);
  }
  else if(comes_from == "Suroeste"){
    tell=where_to_turn_sw(goes_to);
  }
  return tell;
}

//NORTE
function where_to_turn_n(goes_to){
  var turn;

  if(goes_to=="Este"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroeste" || goes_to=="Suroeste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Noreste" || goes_to=="Sureste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Oeste"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Sur"){
    turn = "ALGO RARO PASA EN DIRECCION NORTE SUR";
  }
  return turn;
}

//OESTE
function where_to_turn_w(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroeste" || goes_to=="Noreste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroeste" || goes_to=="Sureste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Este"){
    turn = "ALGO RARO PASA EN DIRECCION OESTE ESTE";
  }
return turn;
}

//ESTE
function where_to_turn_e(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noroeste" || goes_to == "Noreste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la derecha";
  }
  else if(goes_to=="Suroeste" || goes_to=="Sureste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Oeste"){
    turn = "ALGO RARO PASA EN DIRECCION ESTE OESTE";
  }
  return turn;
}

  //SUR
function where_to_turn_s(goes_to){
  var turn;

  if(goes_to=="Este"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noroeste" || goes_to=="Suroeste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Noreste" || goes_to=="Sureste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Oeste"){
    turn = "a la derecha";
  }
  else if(goes_to=="Norte"){
    turn = "ALGO RARO PASA EN DIRECCION SUR NORTE";
  }
  return turn;
}

//SUROESTE
function where_to_turn_sw(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroeste" || goes_to=="Oeste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Sur" || goes_to=="Sureste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Este"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noreste"){
    turn = "ALGO RARO PASA EN DIRECCION ESTE SUROESTE, NORESTE";
  }
  return turn;
}

//SURESTE
function where_to_turn_se(goes_to){
  var turn;
  if(goes_to=="Norte"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noreste" || goes_to=="Este"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Sur" || goes_to=="Suroeste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Oeste"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroeste"){
    turn = "ALGO RARO PASA EN DIRECCION ESTE SUROESTE, NORESTE";
  }
  return turn;
}

//NOROESTE
function where_to_turn_nw(goes_to){
  var turn;

  if(goes_to=="Este"){
    turn = "a la derecha";
  }
  else if(goes_to=="Oeste" || goes_to=="Suroeste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Norte" || goes_to=="Noreste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Sureste"){
    turn = "ALGO RARO PASA EN DIRECCION NOROESTE SURESTE ";
  }
  return turn;
}

//NORESTE
function where_to_turn_ne(goes_to){
  var turn;

  if(goes_to=="Sur"){
    turn = "a la derecha";
  }
  else if(goes_to=="Norte" || goes_to=="Noroeste"){
    turn = "ligeramente a la izquierda en direccion " + goes_to;
  }
  else if(goes_to=="Este" || goes_to=="Sureste"){
    turn = "ligeramente a la derecha en direccion " + goes_to;
  }
  else if(goes_to=="Oeste"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroeste"){
    turn = "ALGO RARO PASA EN DIRECCION NORESTE SURESTE ";
  }
  return turn;
}

//}window.onload=init;
window.onresize = handleResize;
window.onload=handleResize;
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker

//}window.onload=init;
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker

