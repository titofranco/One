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

document.getElementById("initial_point").value='';
document.getElementById("end_point").value='';

if(GBrowserIsCompatible){

    var centerLatitude = 6.2645966700;
    var centerLongitude = -75.5877166080;
    var startZoom = 17;
    var lat;
    var lng;
    var point;
    var countInitial=0;
    var countFinal=0;

    var map = new GMap2(document.getElementById("content"));
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
      var marker;
        if(countInitial==0){
            marker = new GMarker(point,{draggable:true});
            map.addOverlay(marker);
            document.getElementById("initial_point").value=lat+','+lng;
            contextmenu.style.visibility="hidden";
            countInitial=1;
        }

        GEvent.addListener(marker, "dragend", function() {
         document.getElementById("initial_point").value=marker.getPoint().lat()+","+marker.getPoint().lng();
        });
      }

      function getFinalPoint() {
        var marker;
        if(countFinal==0){
            marker = new GMarker(point,{draggable:true});
            map.addOverlay(marker);
            document.getElementById("end_point").value=lat+','+lng;
            contextmenu.style.visibility="hidden";
            countFinal=1;
         }

        GEvent.addListener(marker, "dragend", function() {
         document.getElementById("end_point").value=marker.getPoint().lat()+","+marker.getPoint().lng();
        });
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


//}window.onload=init;
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker

