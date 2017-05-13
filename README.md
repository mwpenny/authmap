# authmap
An interactive map of failed server login attempts as seen [here](http://mattp.ca/authmap)


### Features
* View geolocated IPs of failed server login attempts on a map
* Street view to find those meddling hackers?

### Dependencies
* [node.js](http://github.com/joyent/node) - evented I/O for the backend
* [express](http://github.com/strongloop/express) - web framework for node
* [jade](http://github.com/jadejs/jade) - HTML template engine
* [logfailmap](http://github.com/mwpenny/logfailmap) - failed login IP geolocator

### Installation
`npm install authmap`

### Configuration
cd to `authmap/config` and run `update-attempts.js` to create the attempts file. Set this script to run periodically to keep the attempts file updated.

### Usage
Start the server and browse to `http://SERVER:PORT/authmap`
