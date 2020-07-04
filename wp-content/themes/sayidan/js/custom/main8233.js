/**
 * Created by kenzap on 15/09/2016.
 */

(function ($) {
 "use strict";

 var wrapper_popup = $(".wrapper-popup");
 var bg_popup = $(".bg-popup");
 var popup_content = $(".popup-content");
 var overflow_body = $("body");
 var latlon = '';

 $("a,div,button").on("click", function(){
               
    if ( $(this).hasClass("galery-item") ) {
       wrapper_popup.addClass("ready-popup");
       bg_popup.addClass("ready-popup");
       overflow_body.addClass("overflow-body")
       // add content in popup
       var galery_content = $(this).find(".box-content-item").html();
       popup_content.html(galery_content);
    }else if ( $(this).hasClass("close-popup")){

       wrapper_popup.removeClass("ready-popup");
       bg_popup.removeClass("ready-popup");
       overflow_body.removeClass("overflow-body")
    }else if ( $(this).hasClass("btn_view_map")){

       setTimeout( function(){resizingMap();}, 400);
       latlon = $(this).attr('data-address');
    }else if ($(this).hasClass("navbar-toggle")) { 

      if(!$("#navbar-mobile").hasClass("in")){
        $(this).addClass('open');
      }else{
        $(this).removeClass('open');
      }
    }
  });

  var sf_menu = $(".sf-menu");
  if( sf_menu.length > 0 ){

    var count = sf_menu.children().length;
    if( count == 3 || count == 7 || count == 11){
      sf_menu.append("<li></li>");
    }

    if( count == 2 || count == 6 || count == 10){
      sf_menu.append("<li></li><li></li>");
    }

    if( count == 1 || count == 5 || count == 9){
      sf_menu.append("<li></li><li></li><li></li>");
    }
  }
 
 /*----------------------------
  One Columns Slider
  ------------------------------ */
 $(".columns1").owlCarousel2({
      loop: (($(".columns1").attr('data-loop')=="1")?true:false),
      autoPlay: (($(".columns1").attr('data-autoplay')=="1")?true:false),
      items: 1,
      smartSpeed: 200,
      margin: 0,
      singleItem: true,
      nav: true,
      dots: true,
      autoplayTimeout: parseInt($(".columns1").attr('data-autoplaytimeout'))
 });

 $(".columns2").owlCarousel({
      loop: false,
      autoPlay: false,
      items: 1,
      margin: 0,
      singleItem: true,
      nav: true,
      dots: false,
 });
 // Filter Events
 $(".event-filter").on('changed.owl.carousel', function(property){
                       
     var current = property.item.index;
     var id = $(property.target).find(".event-item").eq(current).attr('id');
     $(".event-list-item").hide();
     $(".event-id-"+id).fadeIn('fast');
 });
 
 if($('div.event-list-item').length){
     $(".event-list-item").hide();
     var event_list_id = $(".event-list-content").attr('id');
     event_list_id = event_list_id.split("-")[3];
     $(".event-id-"+event_list_id).fadeIn('fast');
 }

 function resizingMap() {

     var latitude = 53, longitude = -1.33;
     if(latlon.indexOf(',') > -1){
 
        latitude = latlon.split(',')[0];
        longitude = latlon.split(',')[1];
        latitude = parseFloat(latitude.trim());
        longitude = parseFloat(longitude.trim());
     }
 
     var map;
     var myCenter = new google.maps.LatLng(latitude, longitude);
     var marker = new google.maps.Marker({
         position:myCenter
     });
 
     var mapProp = {
         center:myCenter,
         zoom: 14,
         draggable: false,
         scrollwheel: false,
         mapTypeId:google.maps.MapTypeId.ROADMAP
     };
     
     map=new google.maps.Map(document.getElementById("map-canvas"), mapProp);
     marker.setMap(map);
     google.maps.event.addListener(marker, 'click', function() {
                                   
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
                                   
     });

     if(typeof map =="undefined") return;
     var center = map.getCenter();
     google.maps.event.trigger(map, "resize");
     map.setCenter(center);
 }

 //waypoints animation on scroll
 $(".footer-wrapper").waypoint(function() {
                             
    $('.footer-col').addClass('fadeIn');
 }, { offset: '100%'});
 
})(jQuery);

function initMap() {
  var mapCanvas = document.getElementById("map");
  if(mapCanvas == null) 
    return;
  var myCenter = new google.maps.LatLng(mapCanvas.dataset.latitude, mapCanvas.dataset.longitude);
  var mapOptions = {
    center: myCenter,
    zoom: ((mapCanvas.dataset.zoom=='')?15:parseInt(mapCanvas.dataset.zoom)),
    disableDoubleClickZoom: true,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    zoomControl: false,
    scrollwheel: false,
    styles: [
    {
      featureType: 'all',
      stylers: [
      { saturation: ((mapCanvas.dataset.saturation=='')?(-80):parseInt(mapCanvas.dataset.saturation)) },
      { hue: ((mapCanvas.dataset.hue=='')?'#ccc':mapCanvas.dataset.hue) },
      ]
    }, {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
      { hue: '#654ef4' },
      { saturation: 50 }
      ]
    }, {
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
      { visibility: 'off' }
      ]
    }
    ]
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({});
  if(mapCanvas.dataset.pointer=='pointer'){

    marker = new google.maps.Marker({
      position: myCenter,
      map: map,
      title: mapCanvas.dataset.balloon
    });
  }else{
    var infowindow = new google.maps.InfoWindow({
      position: myCenter,
      content: mapCanvas.dataset.balloon
    });
    infowindow.open(map, marker);
  }
}
