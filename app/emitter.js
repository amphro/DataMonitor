
/**
 * Emit
 */
var io = null;
var emitter = null;
var EventEmitter = require("events").EventEmitter;

module.exports = {
    connect : function(http) {
        io = require('socket.io')(http);
        emitter = new EventEmitter()

        // Other listeners in node were not getting fired when io
        // emitted a connection event. TODO make sure io is an emitter
        io.on('connection', function(socket){
            console.log('a user connected');
            emitter.emit('connection', socket);
        });
    },
    emit : function(event, data, onlyServer) {
        // Notify emitters.
        if (io && !onlyServer) {
            io.emit.call(io, event, data);
        }
        emitter.emit.call(emitter, event, data);
    },
    on : function(event, onFn) {
        emitter.on.call(emitter, event, onFn)
    }
}
