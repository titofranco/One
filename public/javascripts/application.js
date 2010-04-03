// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// 6.2645966700,-75.5877166080;
$(document).ready(function() {
var centerLatitude = 6.2645966700;
var centerLongitude = -75.5877166080;
var startZoom = 17;

      var map = new GMap2(document.getElementById("content"));

        map.addControl(new GMapTypeControl());
        map.addControl(new GSmallMapControl());
        var location = new GLatLng(centerLatitude,centerLongitude);
        map.setCenter(location,startZoom);

    $('#content').contextMenu('myMenu', {

      bindings: {
        'Punto_Inicial': function(t) {
          alert('Trigger was '+t.id+'\nAction was Punto Inicial');
        },

        'Punto_Final': function(t) {
          alert('Trigger was '+t.id+'\nAction was Punto Final');
        },
      }
    }); //context menu end
});

function addMarker(latitude,longitude,description){

    var marker = new Gmarker(new GLatLng(centerLatitude,centerLongitude))

    GEvent.addListener(marker,'click',
    function(){
    marker.openInfoWindowHtml(description)
    })

    map.addOverlay(marker);

}

//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker
window.unonload = GUnload;

