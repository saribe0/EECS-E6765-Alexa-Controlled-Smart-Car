var AWS = require("aws-sdk");
var iotdata = new AWS.IotData({
  endpoint: 'a3uqiy2b4yzpan.iot.us-east-1.amazonaws.com',
  apiVersion: '2015-05-28'
});

var MQTT_TOPIC = "car_controller";

exports.handler = (event, context, callback) => {
    console.log(event);
    var request;
    var error = {
        Error: "An error occurred"
    };
    
    if (!event.hasOwnProperty("action")) {
            callback(null, error);
    }
    if (event.speed != null) {
        request = {
            speed: event.speed,
            action: event.action
        };
    }
    else {
        request = {
            action: event.action
        };
    }
    
    // Prepare request
    var params = {
        topic: MQTT_TOPIC,
        payload: new Buffer(JSON.stringify(request)),
        qos: 0
    };
    iotdata.publish(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            callback(null, "Success");
        }
    });
};