// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var map;
var centerLatitude = 6.2645966700;
var centerLongitude = -75.5877166080;
var startZoom = 17;

function init(){
    if(GBrowserIsCompatible()){
        map = new GMap2(document.getElementById("map"));
        map.addControl(new GSmallMapControl());
        map.setCenter(new GLatLng(centerLatitude,centerLongitude),startZoom);
    }
}

window.onload = init;
window.unonload = GUnload;

