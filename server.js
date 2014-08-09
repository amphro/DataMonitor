// server.js

var port = process.env.PORT || 8080;
var http = require('./app/app.js');

// Setup emitting data to the clint
var emitter = require('./app/SocketDataEmitter')(http);

// Start mock data collection. TODO replace with tessel data
var provider = require('./app/MockDataProvider');

provider.init(emitter);

function CycleList() {
    this.array = [];
}

CycleList.prototype.push = function(val) {
    if (this.array.length >= 20) {
        this.array = this.array.splice(1);
    }
    this.array.push(val);
    //console.log(this.array.length);
};

var cache = new CycleList();

emitter.on(provider.EVENT_NAME, function(data) {
    console.log('adding to cache');
    cache.push(data);
});

emitter.on('connection', function(socket) {
    console.log('intializing data for client');
    socket.emit('init', cache.array);
});

// launch
http.listen(port);
console.log('The magic happens on port ' + port);
