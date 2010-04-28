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
var infoRoute=new Object();
var map;
var polyline;
var latlng_street=[];
var latlng_bus=[];
var latlng_metro=[];

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
  var height = windowHeight()- document.getElementById('toolbar').offsetHeight-30;
  document.getElementById('map').style.height = height + 'px';
  document.getElementById('sidebar').style.height = height + 'px';
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
  var selected_polyline = new GPolyline(
                   [new GLatLng(infoRoute[id].lat_start,infoRoute[id].long_start),
                   new GLatLng(infoRoute[id].lat_end,infoRoute[id].long_end)]
                   ,'#1068f0',4,0.8);
  map.addOverlay(selected_polyline);
}

//Función que pinta la ruta de buses, la de vias y la del metro
function drawpolyline(latlng_bus,latlng_street,latlng_metro){

  var arrowIcon = new GIcon();
  arrowIcon.iconSize = new GSize(24,24);
  arrowIcon.shadowSize = new GSize(1,1);
  arrowIcon.iconAnchor = new GPoint(12,12);
  arrowIcon.infoWindowAnchor = new GPoint(0,0);

  polyline = new GPolyline(latlng_street,'#FF6633',6,1);
  map.addOverlay(polyline);
  var polyline_metro = new GPolyline(latlng_metro,'#D0B132',6,0.5);
  map.addOverlay(polyline_metro);
  midArrows(arrowIcon);
}


$(document).ready(function(){
  handleResize();
 if(GBrowserIsCompatible){
  var centerLatitude = 6.144775644;
  var centerLongitude = -75.576174995;
  var startZoom = 17;
  var lat;
  var lng;
  var countInitial=0;
  var countFinal=0;
  var point;
  var divheader=document.getElementById("toolbar");
  var inputForm = document.createElement("form");


  inputForm.setAttribute("action","");
  inputForm.id='input_points';
  inputForm.onsubmit = function() {findRoute(); return false;};

  inputForm.innerHTML=
    '<div id=inputArea><fieldset>'
    + '<label for="initial_point">Punto Inicial</label>'
    + '<input type="text" id="initial_point" name="initial_point" style="width:280px;"/>'
    + '<label for="end_point">Punto Final</label>'
    + '<input type="text" id="end_point" name="end_point" style="width:280px;"/>'
    + '<p><input type="submit" value="Get Directions!"/></p>'
    + '</fieldset></div>';
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
    +'<a href="javascript:void(0)" id="zoomin_func"><div class="context">Zoom In</div></a>'
    +'<a href="javascript:void(0)" id="zoomout_func"><div class="context">Zoom Out</div></a>'
    +'<a href="javascript:void(0)" id="centerMap_func"><div class="context">Center map</div></a>'
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


  function getInitialPoint() {
    if(countInitial==0){
        var marker = new GMarker(point,{draggable:true});
        map.addOverlay(marker);
        document.getElementById("initial_point").value=lat+','+lng;
        contextmenu.style.visibility="hidden";
        countInitial=1;

      GEvent.addListener(marker, "dragend", function() {
        document.getElementById("initial_point").value=marker.getPoint().lat()+","+marker.getPoint().lng();

      });
    }
  }


  function getFinalPoint() {
    if(countFinal==0){
        var marker = new GMarker(point,{draggable:true});
        map.addOverlay(marker);
        document.getElementById("end_point").value=lat+','+lng;
        contextmenu.style.visibility="hidden";
        countFinal=1;

        GEvent.addListener(marker, "dragend", function() {
         document.getElementById("end_point").value=marker.getPoint().lat()+","+marker.getPoint().lng();
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


  function clearMarkers(){
    map.clearOverlays();
    document.getElementById("initial_point").value='';
    document.getElementById("end_point").value='';
    countInitial=0;
    countFinal=0;
    contextmenu.style.visibility="hidden";
  }


  GEvent.addListener(map,'click',function(overlay,latlng) {
   // Remove one single marker
   /* if(overlay) {
      map.removeOverlay(overlay);
    }*/
    contextmenu.style.visibility="hidden";
  });

 }else{alert("Your Browser Is Not Compatible")}


});


//Metodo que hace la llamada asincrona al controlador, pasando los parametros
//correspondientes y evaluando la respuesta dada por este
function findRoute(){
  var init_lat_lng = document.getElementById("initial_point").value;
  var end_lat_lng = document.getElementById("end_point").value;
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
    var label_a=content[i].label_a;
    var way_type_b=content[i].way_type_b;
    var street_name_b=content[i].street_name_b;
    var prefix_b=content[i].prefix_b;
    var label_b=content[i].label_b;
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
    label_a:label_a,
    way_type_b:way_type_b,
    street_name_b:street_name_b,
    prefix_b:prefix_b,
    label_b:label_b,
    bearing:bearing,
    direction:direction
    };

    console.debug("\n el ID: " + id + " INIT: " + lat_start+"," + long_start + " END: " + lat_end + "," + long_end +
    " BEARING: " + bearing + " DIRECTION: " + direction  + " STREET_NAME_A: " + way_type_a + street_name_a +
    " STREET_NAME_B: "+ way_type_b + street_name_b + " STRETCH_TYPE: " + stretch_type);

    latlng_street.push(new GLatLng(lat_start,long_start));
    //latlng_street.push(new GLatLng(lat_end,long_end));
    if(stretch_type > 2){latlng_metro.push(new GLatLng(lat_start,long_start));}

    }
  //Se adiciona el ulitmo trayecto
  latlng_street.push(new GLatLng(lat_end,long_end));
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
  else if (bearing > 66.5 && bearing <= 115 ){direction="Este"}
  else if (bearing > 115 && bearing <= 157.5 ){direction="Sureste"}
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
//  console.debug("El tamaño del hash: " + size);

  for(var i=0;i<size;i++){
    if(first_node){
      explain = '<li><a href="#" onclick="javascript:focusPoint('+i+')">'+ "Usted está en: " +
      "<b>" + infoRoute[i].way_type_a + " " + infoRoute[i].street_name_a + "</b>" +
      " dirigete en dirección " + infoRoute[i].direction + " hacia la "
      +"<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>";
       first_node=false;
    }
    else if(infoRoute[i-1].direction==infoRoute[i].direction && continueStraight==false){

       explain += '<li><a href="#" onclick="javascript:focusPoint('+i+')">'+
       "Sigue derecho en dirección: <b> " + infoRoute[i].direction + "</b> por la: " +
       "<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>" ;

       if(infoRoute[i].direction==infoRoute[i+1].direction)
       continueStraight=true;

    }
    else if(continueStraight==true && infoRoute[i-1].direction==infoRoute[i].direction){
      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
       "Continua por: " + "<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>" ;
    }
    else if (infoRoute[i-1].direction != infoRoute[i].direction){
      turn = eval_direction(infoRoute[i-1].direction,infoRoute[i].direction)

      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
       "voltear " + "<b>"+ turn+"</b>" + " por " +
       "<b>"+ infoRoute[i].way_type_b +  " " +
       infoRoute[i].street_name_b + "</b></a></li>";
      continueStraight = false;
    }
  }
 // console.debug("La respuesta de direccion \n: " + explain);
  var div_sidebar_list = document.getElementById("sidebar-list");
  div_sidebar_list.innerHTML=explain;

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

