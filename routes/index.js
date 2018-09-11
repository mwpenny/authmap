var express = require('express');
var fs = require('fs');

var router = express.Router();
var attempts = null;
var ips = [];

router.get('/ip-count', function(req, res) {
    res.send(JSON.stringify({count: ips.length}));
});

router.get('/attempts', function(req, res) {
    var start = req.query.start || 0;
    var end = req.query.end || ips.length;

    // Filter
    var ipSlice = ips.slice(start, end);
    var connections = {};
    for (var i = 0; i < ipSlice.length; ++i) {
        var ip = ipSlice[i];
        connections[ip] = attempts['connections'][ip];
    }

    //Send failed attempts
    res.send({
        'date': attempts.date,
        'connections': connections
    });
});

// Cache failed login attempt data
fs.readFile("config/attempts.json", "utf-8", function(err, data) {
    if (err) {
        console.log("Could not initialize attempts object. Make sure attempts.json exists!");
    } else {
        attempts = JSON.parse(data);
        ips = Object.keys(attempts['connections'])
    }
});

module.exports = router;
