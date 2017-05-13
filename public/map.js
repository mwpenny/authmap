//map.js
/* Places pins on a map using failed login attempt data */

var infoWindow;

/* Show details on the map about a login attempt */
var showPinInfo = function(pin, geodata) {
    $.get("pin", geodata, function(data) {
        if (infoWindow)
            infoWindow.close();
        else
            infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(data);
        infoWindow.open(map, pin);
    });
}

/* Use lat/long and place pin for login attempt */
var addPin = function(geodata) {
    var pin = new google.maps.Marker({
    position: {lat: geodata.latitude, lng: geodata.longitude},
        map: map,
        title: geodata.ip
    });

    /*var circle = new google.maps.Circle({
        map: map,
        radius: 1000*geodata.attempts,
        fillColor: '#AA0000'
    });
    circle.bindTo('center', pin, 'position');*/

    google.maps.event.addDomListener(pin, 'click', function() {
        showPinInfo(pin, geodata);
    });
}

/* Get login attempt objects from server */
var getAttempts = function() {
    $.getJSON("attempts", function(data) {
        var attempts = JSON.parse(data);
        var d = new Date(attempts.date);
        var time = d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        $(".footer > #timestamp").text("Map data updated at " + time + " on " + d.toLocaleDateString());

        $.each(attempts.connections, function(key, val) {
            addPin(val);
        });
    });
}

var map;

/* Init gmap */
function init() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 2,
        minZoom: 1,
        center: {lat: 30, lng: 0}
    });

  getAttempts();
}

google.maps.event.addDomListener(window, 'load', init);
