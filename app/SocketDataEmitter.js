/**
 * Socket.io will not allow multiple on listeners, so use an
 * event emitter to pass the events around.
 *
 * TODO Look into why Socket.io doesn't return an EventEmitter (or
 * or why we can't chain multiple on listeners)
 */

module.exports = function(http) {
    var io =  require('socket.io')(http);

    var EventEmitter = require("events").EventEmitter;
    var socketDataProvider = new EventEmitter();

    var ioEmit = io.emit;
    var emitterEmit = socketDataProvider.emit;

    io.on('connection', function(socket){
        console.log('a user connected');
        emitterEmit.call(socketDataProvider, 'connection', socket);
    });

    socketDataProvider.emit = function(event, data) {
        ioEmit.call(io, event, data);
        emitterEmit.call(socketDataProvider, event, data);
    }

    return socketDataProvider;
};
