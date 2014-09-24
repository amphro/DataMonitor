var EVENT_NAME = 'temperature';
var emitter = require('../emitter.js');
var cache = require('../cache.js');

module.exports = {
    newTemp : function(temp) {
        emitter.on('connection', function(socket) {
            socket.emit('init-' + EVENT_NAME, cache.getValues(EVENT_NAME));

            socket.on('init-request-' + EVENT_NAME, function() {
                socket.emit('init-' + EVENT_NAME, cache.getValues(EVENT_NAME));
            });
        });

        var data = {temp : temp, time : Date.now()};
        cache.addValue(EVENT_NAME, data);
        emitter.emit(EVENT_NAME, data);
    }
}
