// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// 6.2645966700,-75.5877166080;

// The Javascript Menu and its functions is based on code provided by the
// Community Church Javascript Team
// http://www.bisphamchurch.org.uk/
// http://econym.org.uk/gmap/

//function init(){
$(document).ready(function(){

 if(GBrowserIsCompatible){

  var centerLatitude = 6.336830973;
  var centerLongitude = -75.559142337;
  var startZoom = 15;
  var lat;
  var lng;
  var countInitial=0;
  var countFinal=0;
  var map;
  var point;

  var divheader=document.getElementById("header");
  var inputForm = document.createElement("form");
  inputForm.setAttribute("action","");
  inputForm.id='input_points';
  inputForm.onsubmit = function() {findRoute(); return false;};

  inputForm.innerHTML=
    '<fieldset style="width:1000px;">'
    + '<legend>Puntos</legend>'
    + '<label for="initial_point">Punto Inicial</label>'
    + '<input type="text" id="initial_point" name="initial_point" style="width:280px;"/>'
    + '<label for="end_point">Punto Final</label>'
    + '<input type="text" id="end_point" name="end_point" style="width:280px;"/>'
    + '<p><input type="submit" value="Get Directions!"/></p>'
    + '</fieldset>';
  divheader.appendChild(inputForm);
  document.getElementById("initial_point").value='';
  document.getElementById("end_point").value='';
  document.getElementById("initial_point").setAttribute("readonly","readonly");
  document.getElementById("end_point").setAttribute("readonly","readonly");

  map = new GMap2(document.getElementById("content"));
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
          //console.debug("el length " + content.length)
           //bearing(6.2645966700,-75.5877166080,6.2628485150,-75.5888434600);
           parseContent(content);
        //  console.debug("que mierda");
          }
      }
    }
    request.send(null);
    return false;
  }

  function parseContent(content){

    var latlng_street=[];
    var latlng_bus=[];
    var latlng_metro=[];
    var infoRoute=new Object();

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

      /*  console.debug("el roadmap id " + roadmap_id);
      console.debug("el related " + maproad_related_id);*/
       console.debug("el lat_start " + lat_start);
      // console.debug("el long_start " + long_start);
      //console.debug("el lat_end " + lat_end);
      // console.debug("el long_end " + long_end);
      //console.debug("el stretch_type " + stretch_type);
      //Se adiciona solo el inicial, porque la lat/long final del nodo i es igual*/
      //a la lat/long inicial del nodo i+1
      latlng_street.push(new GLatLng(lat_start,long_start));
      if(stretch_type > 2){latlng_metro.push(new GLatLng(lat_start,long_start));}

      }
    //Se adiciona el ulitmo trayecto
    latlng_street.push(new GLatLng(lat_end,long_end));
    drawpolyline(latlng_bus,latlng_street,latlng_metro);
  //  explainRoute(infoRoute);
  }

  //Got from http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
  Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
  };

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

  function drawpolyline(latlng_bus,latlng_street,latlng_metro){
    var polyline = new GPolyline(latlng_street,'#FF6633',4,0.8);
    map.addOverlay(polyline);
    var polyline_metro = new GPolyline(latlng_metro,'#D0B132',6,0.5);
    map.addOverlay(polyline_metro);
  }

  function explainRoute(infoRoute){
    var continueStraight=false;
    var size = Object.size(infoRoute);
    var explain;
    console.debug("El tamaño del hash: " + size);
    for(var i=0;i<size-1;i++){

      if(infoRoute.direction[i]==infoRoute.direction[i+1] && explain==false){
         explain = "Siga derecho en direccion " + infoRoute.direction + " pasando por las siguientes vias ";
         continueStraight=true;
      }
      else if(continueStraight==true){
        explain =  explain.way_type_a + " con " + infoRoute.street_name_a + " ";
      }
      else if (infoRoute.direction[i] != infoRoute.direction[i+1]){
        //Poner voltear a tal direccion
        explain = "voltear a la ";
      }
    }
  /*  var divleftpanel = document.getElementById("left");
    var list = document.createElement("lu");

    for(var i=0;i<10;i++){
      list.innerHTML =
    } */

  }

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

  //OESTE
  function where_to_turn_w(goes_to){
    var turn;
    // OESTE
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
  }

  //ESTE
  function where_to_turn_e(goes_to){
    var turn;

    //ESTE
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

  function where_to_turn_n(goes_to){
    var turn;
    //NORTE
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

  function where_to_turn_s(goes_to){
    var turn;
    //SUR
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


  function where_to_turn_sw(goes_to){
    var turn;
    //SUROESTE
    if(goes_to=="Norte"){
      turn = "a la derecha";
    }
    else if(goes_to===="Noroeste" || goes_to=="Oeste"){
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

//SUROESTE
  function where_to_turn_se(goes_to){
    var turn;
    if(goes_to=="Norte"){
      turn = "a la izquierda";
    }
    else if(goes_to===="Noreste" || goes_to=="Este"){
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
    else if(goes_to===="Oeste" || goes_to=="Suroeste"){
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




 }else{alert("Your Browser Is Not Compatible")}


});

    else if (bearing > 22.5 && bearing <= 66.5 ){direction="Noreste"}
    else if (bearing > 66.5 && bearing <= 115 ){direction="Este"}
    else if (bearing > 115 && bearing <= 157.5 ){direction="Sureste"}
    else if (bearing > 157.5 && bearing <= 202.5 ){direction="Sur"}
    else if (bearing > 202.5 && bearing <= 247.5 ){direction="Suroeste"}
    else if (bearing > 247.5 && bearing <= 292.5 ){direction="Oeste"}
    else if (bearing > 292.5 && bearing <=337.5  ){direction="Noroeste"}


//}window.onload=init;
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker

