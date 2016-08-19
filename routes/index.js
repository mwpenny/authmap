var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get('/attempts', function(req, res) {
    var attempts = {};
    
    //Send failed attempts
    fs.readFile("config/attempts.json", "utf-8", function(err, data) {
        if (err) console.log("Could not initialize attempts object. Make sure attempts.json exists!");
        else attempts = data;
        res.send(JSON.stringify(attempts));
    });
});

router.get('/pin', function(req, res) {
  var title = "";
  
  /*Construct title
    Assume more broad information is available (i.e., country) if
    more specific (i.e., city) is available */
  if (req.query.city) title += req.query.city + ", ";
  if (req.query.region_name) title += req.query.region_name + ", ";
  if (req.query.country_name) title += req.query.country_name;
  if (title == "") title = req.query.ip; //Fall back to IP

  res.render('pin', { title: title, geodata: req.query } );
});

module.exports = router;