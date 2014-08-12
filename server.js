// server.js

var port = process.env.PORT || 8080;
var http = require('./app/app.js');

// Setup emitting data to the clint
var emitter = require('./app/emitter.js');
emitter.connect(http);

// Start generating mock data to the client
require('./app/MockDataProvider').init(emitter);

// launch
http.listen(port);
console.log('The magic happens on port ' + port);
