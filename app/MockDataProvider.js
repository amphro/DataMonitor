

module.exports = {
    EVENT_NAME : 'TEMP',
    minTemp : 30,
    maxTemp : 110,
    currentTemp : 70,
    intervalId : null,
    init : function(emitter) {
        this.startDataStream(emitter);
    },
    startDataStream : function(emitter) {
        var self = this;
        this.intervalId = setInterval(function() {
            var directionUp = parseInt(Math.random() * 10 % 2);
            var randInt = Math.random() / 10;
            if (directionUp) {
                self.currentTemp += randInt;
            } else {
                self.currentTemp -= randInt;
            }

            emitter.emit(self.EVENT_NAME, {temp : self.currentTemp, time : Date.now()});
            //console.log('emitted data to ' + self.EVENT_NAME);
        }, 5000);
    }
}
