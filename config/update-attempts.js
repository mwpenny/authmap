#!/usr/bin/node
var logfailmap = require('logfailmap');
var fs = require('fs');

//Cache failed login information
console.log("Getting failed login attempt host IPs and geodata. This could take a while...");
logfailmap('/var/log/btmp', function(attempts) {
    console.log("Retrieved failed login attempt host IPs and geodata");
    fs.writeFile("attempts.json", JSON.stringify(attempts), function(err) {
        if (err) console.log("Could not write IP information to file");
        else console.log("IP information written to file");
    });
});
