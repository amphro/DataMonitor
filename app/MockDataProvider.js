
var cache = require('./cache.js');
var EVENT_NAME = 'mockData';
var currentTemp = 70;
var intervalId = null;

module.exports = {
    init : function(emitter) {
        this.startDataStream(emitter);

        emitter.on(EVENT_NAME, function(data) {
            //console.log('adding to cache');
            cache.addValue(EVENT_NAME, data);
        });

        emitter.on('connection', function(socket) {
            socket.emit('init-' + EVENT_NAME, cache.getValues(EVENT_NAME));

            socket.on('init-request-' + EVENT_NAME, function() {
                socket.emit('init-' + EVENT_NAME, cache.getValues(EVENT_NAME));
            });
        });

    },
    startDataStream : function(emitter) {
        intervalId = setInterval(function() {
            var directionUp = parseInt(Math.random() * 10 % 2);
            var randInt = Math.random() / 10;
            if (directionUp) {
                currentTemp += randInt;
            } else {
                currentTemp -= randInt;
            }

            emitter.emit(EVENT_NAME, {temp : currentTemp, time : Date.now()});
            //console.log('emitted data to ' + EVENT_NAME);
        }, 5000);
    }
}
