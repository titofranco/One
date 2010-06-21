
var current_sb_item=false;
var arrow_marker;
var initial_marker;
var final_marker;
var route_marker;

var polyline;
var selected_polyline;
var polyline_metro;
var polyline_bus;


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
function drawPolyline(latlng_street,latlng_metro){
  console.debug("el tamaño del array " + latlng_street.length);
  polyline = new GPolyline(latlng_street,'#FF6633',7,1);
  map.addOverlay(polyline);
  polyline_metro = new GPolyline(latlng_metro,'#D0B132',4,1);
  map.addOverlay(polyline_metro);
}

//Random colors: http://paulirish.com/2009/random-hex-color-code-snippets/
//Función de prueba para pintar varias rutas de buses
function drawPolyline_bus(buses_hash){
  var latlng_bus =[];
  var size=Object.size(buses_hash);
  for (var i=0;i<size-1;i++){
    if(buses_hash[i].bus_id == buses_hash[i+1].bus_id){
      latlng_bus.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
    }
    else {
      var color='#'+Math.floor(Math.random()*16777215).toString(16);
      var polyline_bus = new GPolyline(latlng_bus,color,4,0.8);
      map.addOverlay(polyline_bus);
      latlng_bus=[];
    }
  }
}

//Función para pintar sólo una ruta de bus
function drawSelectedPolyline_bus(checkbox,bus_id){
  var latlng_bus =[];
  var size=Object.size(overlay_buses_hash);
  var color;
  var polyline_bus;
  for (var i=0;i<size;i++){
    if(bus_id == overlay_buses_hash[i].bus_id){
      polyline_bus=overlay_buses_hash[i].polyline_bus;
      break;
    }
  }
  map.addOverlay(polyline_bus);
  addClassSidebarBus('#sidebar-item-bus',bus_id,checkbox);

}

//Se crean todos los overlays para los buses
function createBusesOverlays(size){
var j=0;
var latlng_bus=[];
  for(var i=0;i<size;i++){
    if(buses_hash[i].bus_id == buses_hash[i+1].bus_id){
      latlng_bus.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
    }
    else {
      latlng_bus.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
      var color='#'+Math.floor(Math.random()*16777215).toString(16);
      while(color.length<=6){
        color='#'+Math.floor(Math.random()*16777215).toString(16);
      }
      var polyline_bus = new GPolyline(latlng_bus,color,4,0.8);
      overlay_buses_hash[j]={bus_id:buses_hash[i].bus_id,polyline_bus:polyline_bus};
      latlng_bus=[];
      j++;
    }
  }
}



//Remueve la polylinea del bus seleccionada
function removeSelectedPolyline_bus(bus_id){
  var size=Object.size(overlay_buses_hash);
  for (var i=0;i<size;i++){
    if(bus_id == overlay_buses_hash[i].bus_id){
      polyline_bus=overlay_buses_hash[i].polyline_bus;
      break;
    }
  }
  map.removeOverlay(polyline_bus);
}

//Asigna un color aleatorio a ultima posicion relativa del arreglo antes de que
//encuentre un nuevo bus_id
/*function AssignRandomColor(size){
  for(var i=0; i<size;i++){
    if(buses_hash[i].bus_id != buses_hash[i+1].bus_id){
      var color='#'+Math.floor(Math.random()*16777215).toString(16);
      //Si el color es de 6 digitos incluye el signo # la ruta no es pintada
      while(color.length<=6){
        color='#'+Math.floor(Math.random()*16777215).toString(16);
      }
      buses_hash[i].color=color;
    }
  }
}*/

//Cambia el CSS del sidebar-item-id cuando se hace clic sobre este
function addClassSidebar(element,id){
  if($(element+''+current_sb_item).hasClass('current')){
    $(element+''+current_sb_item).removeClass('current');
  } $(element+''+id).addClass('current');
    current_sb_item=id;
}

//Cambia el CSS del sidebar-item-bus-id cuando se hace clic sobre el checkbox
function addClassSidebarBus(element,id,checkbox){
  if(checkbox.checked==false && $(element+''+id).hasClass('current')){
    $(element+''+id).removeClass('current');
    removeSelectedPolyline_bus(id);
  }else if(checkbox.checked==true){
    $(element+''+id).addClass('current');
  }
}


//Elimina todos los overlays existentes en el mapa
function clearExistingOverlays(){
  if(polyline_metro){map.removeOverlay(polyline_metro);}
  if(polyline){ map.removeOverlay(polyline);}
  if(selected_polyline){map.removeOverlay(selected_polyline);}
  if(route_marker){map.removeOverlay(route_marker);}
  if(arrow_marker){map.removeOverlay(arrow_marker);}

}

//Este metodo es para asignar la lat-lng más cercana al marker a el initial_marker y al final_marker
function setLatLngMarkers(lat_start,long_start,lat_end,long_end){
  initial_marker.setLatLng(new GLatLng(lat_start,long_start));
  final_marker.setLatLng(new GLatLng(lat_end,long_end));
}


//Adiciona el li correspondiente a cada ruta de bus al panel derecho (sidebar)
function addBusesSidebar(buses_hash){
  var explain ='';
  var size = Object.size(buses_hash);
  explain = '<hr><li class="route-explain">'+
            '<b class="header">Indicación de ruta de bus cercana</b></li>';
  for(var i=0;i<size-1;i++){
    if(buses_hash[i].bus_id != buses_hash[i+1].bus_id){

      explain += '<span class=buses-checkbox> <li id=sidebar-item-bus'+(buses_hash[i].bus_id)+' >'+
                  '<input type="checkbox" name="chk'+buses_hash[i].bus_id+'"' +
                  ' onClick="javascript:drawSelectedPolyline_bus('+"this,"+buses_hash[i].bus_id+')">'+
                  " Ruta numero " + buses_hash[i].bus_id + "</li></span>";
    }
  }
  var div_sidebar_bus_list = document.getElementById("sidebar-bus-list");
  div_sidebar_bus_list.innerHTML=explain;
}

//Explica la ruta a tomar y la pone en el panel derecho (sidebar)
function explainRoute(infoRouteHash){
  var continueStraight=false;
  var size = Object.size(infoRouteHash);
  var explain;
  var turn;
  var first_node=true;
  var estacion_metro=false;
  var curr_dir;
  var prev_dir;
  var curr_stretch_type;
  var prev_stretch_type;
  var curr_bearing;
  var prev_bearing;
  var total_distance = getTotalDistanceRoute(infoRouteHash,size);
  var total_time = getTimeAprox(total_distance);
  //La variable j indica el número de pasos que requiere el algoritmo
  var j=1;
  console.debug("el tamaño del hash " + size);
  //Estas son las estadisticas de la ruta
  explain = '<li class="route-explain">'
  +'<b class="header">Indicaciones de ruta a pie para llegar a tu lugar de destino</b>'
  +'<table><br><tr><td><b>Distancia aproximada: </b></td><td>' + total_distance + ' metros</td></tr>'
  +'<tr><td><b>Tiempo aproximado caminando a 3km/h: </b></td><td>' + total_time + ' minutos</td></tr>'
  +'</table></li>';
  for(var i=0;i<size-1;i++){
    //Asigno (direccion y stretch_type) actual y anterior
    //evaluo debo seguir derecho
    if(i>0){
      prev_stretch_type = infoRouteHash[i-1].stretch_type;
      curr_stretch_type = infoRouteHash[i].stretch_type;
      prev_bearing = infoRouteHash[i-1].bearing;
      curr_bearing = infoRouteHash[i].bearing;
      prev_dir = infoRouteHash[i-1].direction;
      curr_dir = reAssingDirection(prev_dir,infoRouteHash[i].direction,prev_bearing,curr_bearing);

      if(prev_dir==curr_dir){
        continueStraight=true;
      }
    }

    if(first_node){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'
      +j + ". " + "Dirigete en dirección <b>" + infoRouteHash[i].direction + "</b> hacia la "
      +"<b>"+ infoRouteHash[i].way_type_b +  " "
      +infoRouteHash[i].street_name_b +  " (metros: " + infoRouteHash[i].distance + ")" + "</b></a></li>";
      first_node=false;
    }
    /*else if((prev_dir==curr_dir) && continueStraight==false && curr_stretch_type=='1'){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
      j + ". " + "Sigue derecho en dirección: <b> " + infoRouteHash[i].direction + "</b> por la: " +
      "<b>"+ infoRouteHash[i].way_type_b +  " " +
      infoRouteHash[i].street_name_b + " (metros:" + infoRouteHash[i].distance + ")" +"</b></a></li>" ;

      if(curr_dir==infoRouteHash[i+1].direction)
      continueStraight=true;
    }*/

    else if(continueStraight==true && (prev_dir==curr_dir) && curr_stretch_type=='1'){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(i)+')">'
      +j + ". Continúa por: " + "<b>"+ infoRouteHash[i].way_type_b +  " "
      +infoRouteHash[i].street_name_b + " (metros: " + infoRouteHash[i].distance + ")</b></a></li>";
    }
    else if ( (prev_dir != curr_dir) && curr_stretch_type=='1'){
      turn = eval_direction(infoRouteHash[i-1].direction,infoRouteHash[i].direction)

      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(i)+')">'
      +j + ". Voltear " + "<b>"+ turn+"</b> por <b>"+ infoRouteHash[i].way_type_b +  " "
      +infoRouteHash[i].street_name_b + " (metros: " + infoRouteHash[i].distance + ")</b></a></li>";
      continueStraight = false;
    }

    //SE EXPLICA RUTA PARA ESTACION DEL METRO
    //Este primer else if no es viable porque despues de un tipo 4 puede haber un tipo 1
    /*else if(prev_stretch_type=='1' && curr_stretch_type=='4'){
      explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
      "Dirigete hacia el <b>" + infoRouteHash[i].street_name_a + "</b></a></li>" ;
    }*/
    //Si va en un trayecto o puente y se encuentre con el inicio de una estación entonces
    //indica que el algoritmo cogió por el metro
    else if(prev_stretch_type=='4' && curr_stretch_type=='3'){
      estacion_metro=true;
    }
    //El stretch_type 2 indica que está en un tramo del metro
    else if((prev_stretch_type=='3' && curr_stretch_type=='2') && estacion_metro==true){
      explain += '<li id=sidebar-item-'+i+' >'
      +'<a href="#" onclick="javascript:focusMetro('+infoRouteHash[i-1].related_id+')">'
      +j + ". Ve de la estación <b> " + infoRouteHash[i-1].common_name_a;
    }
    //Si encuentró un stretch_type 3 quiere decir que llegó al final de una estación
    else if(estacion_metro==true && (prev_stretch_type=='2' && curr_stretch_type=='3')) {
      explain += ' hasta la estación <b>'+infoRouteHash[i].common_name_a+'</b></a></li>';
    }
    //Si encontró un stretch_type 4 es porque se bajó del metro y va hacia alguna calle
    else if(prev_stretch_type=='3' && curr_stretch_type=='4'){
      explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
      j + ". Baja de la estación " + infoRouteHash[i-1].common_name_a +
      " dirigete por el <b>"+ infoRouteHash[i].common_name_b +  " " +
      infoRouteHash[i].street_name_a + " (metros:" + infoRouteHash[i].distance + ")</b></a></li>";
      estacion_metro=false;
    }
    j++;
  }
 //Si se tiene mas de 2 nodos entonces se procede a finalizar la explicacion
 //de la ruta
 if(size>1){
  var end;
  if(infoRouteHash[size-2].direction==infoRouteHash[size-1].direction){
    end = j + ". " +'Continúa hasta encontrar tu lugar de destino' +
          "<b> (metros: " + infoRouteHash[i].distance + ")</b>";
  }
  else {
    turn = eval_direction(infoRouteHash[size-2].direction,infoRouteHash[size-1].direction);
    end = j + ". " + 'Voltea <b> '+ turn +'</b> hasta llegar a tu lugar destino </b>' +
    "<b> (metros: " + infoRouteHash[i].distance + ")</b>" ;
  }
  explain += '<li id=sidebar-item-'+i+' >'+
             '<a href="#" onclick="javascript:focusPoint('+(size-1)+')">'+
             end+'</a></li>';
  }
  //En caso tal la ruta sólo tenga una arista
  else{
    explain += '<li id=sidebar-item-'+0+' >'+
               '<a href="#" onclick="javascript:focusPoint('+0+')">'+
               "1. Dirigete en dirección <b>" + infoRouteHash[i].direction +
               "</b> hacia la <b>" + infoRouteHash[i].way_type_b +  " " +
                infoRouteHash[i].street_name_b + "</b> hasta llegar a tu lugar de destino (metros: "
                + infoRouteHash[i].distance + ")</b></a></li>";
  }

  //Se adiciona el HTML al panel derecho
  var div_sidebar_list = document.getElementById("sidebar-list");
  div_sidebar_list.innerHTML=explain;

}

function getTotalDistanceRoute(infoRouteHash,size){
  var total_distance=0;
  for (var i=0;i<size;i++){
    total_distance+=infoRouteHash[i].distance
  }
  return Math.round(total_distance*100)/100;
}

function getTimeAprox(total_distance){
  var time_aprox;
  time_aprox=(total_distance*60)/3000;
  return Math.round(time_aprox);
}

//Crea el form donde va a estar el Origen y Destino
function createInputForm(){
  var divheader=document.getElementById("inputBoxes");
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
}

//Crea el menú desplegable cuando se hace click derecho sobre el mapa
function createContextMenu(){
  var contextmenu=document.createElement("div");

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
    +'<a href="javascript:void(0)" id="clearMarkers_func"><div class="context">Reiniciar origen/destino </div></a>';
  return contextmenu;
}

