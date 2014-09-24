
var API_PATH = '/api/';
var util = require('../utils.js');

var Objects = {
    TEMP : {
        creatable : function(data, req, res) {
            console.log(data);
            require('../data-stores/temperature.js').newTemp(data.temp);
            return { successful : true };
        }
    }
};

module.exports = function(app, passport) {
    for (var objectName in Objects) {
        if (Objects.hasOwnProperty(objectName)) {
            var obj = Objects[objectName];

            if (obj.creatable) {
                app.post(API_PATH + objectName, function(req, res) {//util.isLoggedIn
                    var data = req.body;
                    console.log(req.body);
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }

                    var retVal = obj.creatable(data, req, res);
                    if (typeof retVal === 'object') {
                        retVal = JSON.stringify(retVal);
                    }
                    //console.log(retVal);
                    res.send(retVal);
                });
            }
        }
    }
};
