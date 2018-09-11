//map.js
/* Places pins on a map using failed login attempt data */

var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

var PIN_LOAD_CHUNK_SIZE = 100;
var PIN_AUTOLOAD_LIMIT = 1000;

/* Custom text control to display the number of pins shown, total number of IPs,
   and give the option to load any that remain */
var IPCountControl = L.Control.extend({
    ipTotal: 0,
    shownIPs: 0,
    options: {
        position: 'bottomleft'
    },

    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
        return this._container;
    },

    setIPTotal: function(count) {
        this.ipTotal = count;
        this.update();
    },

    setShownIPs: function(count) {
        this.shownIPs = count;
        this.update();
    },

    update: function() {
        this._container.innerHTML = "Showing " + this.shownIPs + " of " + this.ipTotal + " IP locations";
        if (this.shownIPs < this.ipTotal) {
            this._container.innerHTML += " | <a id='show-more-btn' href='#'>Show more</a>";
            $("#show-more-btn").click(function() {
                getAttempts(PIN_LOAD_CHUNK_SIZE, this.shownIPs);
            });
        }
    }
});


var map;
var annotation;

/* Return HTML containing info about a login attempt for a pin popup.
   Assume more broad information is available (i.e., country) if more
   specific (i.e., city) is available */
var getPinContent = function(geodata) {
    var title = '';
    if (geodata.city)
        title += geodata.city + ', ';
    if (geodata.region_name)
        title += geodata.region_name + ', ';
    if (geodata.country_name)
        title += geodata.country_name;
    if (title == '')
        title = geodata.ip;  // Fall back to IP

    return '<h4>' + title + '</h4>' +
           '<b>IP: </b>' + geodata.ip + '<br>' +
           '<b>Login attempts: </b>' + geodata.attempts + '<br>' +
           '<b>Location: </b>' + geodata.latitude + ', ' + geodata.longitude;
}

/* Use lat/long and place pin for login attempt */
var addPin = function(geodata) {
    var pin = L.marker({lat: geodata.latitude, lng: geodata.longitude});
    pin.bindPopup(getPinContent(geodata));
    pin.addTo(map);
    annotation.setShownIPs(annotation.shownIPs + 1);
}

/* Get login attempt objects from server */
var getAttempts = function(numIPs, offset) {
    numIPs = Math.ceil(numIPs/PIN_LOAD_CHUNK_SIZE) * PIN_LOAD_CHUNK_SIZE;  // Round up to chunk size
    offset = offset || 0;

    for (var i = 0; i < numIPs/PIN_LOAD_CHUNK_SIZE; ++i) {
        var start = (i * PIN_LOAD_CHUNK_SIZE) + offset;
        var end = start + PIN_LOAD_CHUNK_SIZE;
        $.getJSON("attempts?start=" + start + "&end=" + end, function(attempts) {
            var d = new Date(attempts.date);
            $(".footer > #timestamp").text("Failed logins for " + MONTHS[d.getMonth()] + " " + d.getFullYear());

            $.each(attempts.connections, function(key, val) {
                addPin(val);
            });
        });
    }
}

/* Init Leaflet map */
function init() {
    map = L.map('map-canvas').setView([30, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    annotation = new IPCountControl();
    map.addControl(annotation);

    $.getJSON("ip-count", function(res) {
        var numIPs = res.count;
        annotation.setIPTotal(numIPs);
        getAttempts(Math.min(numIPs, PIN_AUTOLOAD_LIMIT));
    });
}

$(document).ready(init);
