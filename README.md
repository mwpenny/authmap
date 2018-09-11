# authmap
An interactive map of failed server login attempts as seen [here](http://mattp.ca/authmap)


### Features
* View geolocated IPs of failed server login attempts on a map
* Find those meddling hackers?

### Dependencies
* [node.js](http://github.com/joyent/node) - evented I/O for the backend
* [express](http://github.com/strongloop/express) - web framework for node
* [jade](http://github.com/jadejs/jade) - HTML template engine
* [logfailmap](http://github.com/mwpenny/logfailmap) - failed login IP geolocator

### Installation
`npm install authmap`

### Configuration
1) cd to `authmap/config`
2) Create `apikey.json` containing a JSON object with a string property called `apikey` containing your [ipstack](https://ipstack.com) API key. This service is used to geolocate IP addresses. Its free tier allows 10000 calls per month.
3) Run `update-attempts.js` to create the attempts file. Set this script to run periodically to keep the attempts file updated.

### Usage
Start the server and browse to `http://SERVER:PORT/authmap`
