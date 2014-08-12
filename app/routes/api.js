
var API_PATH = '/api/';
var util = require('../utils.js');

var Objects = {
    TEMP : {
        creatable : function(data, req, res) {
            console.log('up');
        }
    }
};

module.exports = function(app, passport) {
    for (var objectName in Objects) {
        if (Objects.hasOwnProperty(objectName)) {
            var obj = Objects[objectName];

            if (obj.creatable) {
                app.post(API_PATH + objectName, function(req, res) {//util.isLoggedIn
                    res.send(obj.creatable(req.body, req, res));
                });
            }
        }
    }
};
