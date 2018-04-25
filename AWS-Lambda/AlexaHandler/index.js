// Alexa-controlled car

'use strict';
const Alexa = require('alexa-sdk');
var AWS = require("aws-sdk");
var iotdata = new AWS.IotData({
  endpoint: 'a3uqiy2b4yzpan.iot.us-east-1.amazonaws.com',
  apiVersion: '2015-05-28'
});

var MQTT_TOPIC = "car_controller";

// APP_ID is optional
const APP_ID = "amzn1.ask.skill.27a47f70-9449-4cd9-95e2-5df8985ec556";

const GREETING = 'Launching Pi Car.';
const SKILL_NAME = 'pi car';
const HELP_MESSAGE = 'You can give the Pi Car a command or you can say, exit.';
const HELP_REPROMPT = 'You can give the Pi Car commands such as, move forward or, turn right.';
const STOP_MESSAGE = 'Exiting Pi Car.';

function publishMessage(callback,request){
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
            console.log(data);
            callback(null, "Success");
        }
    });
    return;
}

function buildHandlers (callback){
    const handlers = {
        'LaunchRequest': function () {
            this.emit(":ask", GREETING);
        },
        'ForwardIntent': function () {
            const action = 'forward';
            var time, speechOutput;
            const intentObj = this.event.request.intent;
            time = intentObj.slots.time.value;
            if (!isNaN(intentObj.slots.time.value)) {
                speechOutput = "Moving forward for " + time + " seconds";
            }
            else{
                speechOutput = "Moving forward";
                time = null;
            }
    
            var request = {
                action: action,
                time: time
            }; 
            publishMessage(callback,request);
        
            this.emit(":ask", speechOutput);
        },
        'BackwardIntent': function () {
            const action = 'backward';
            var time, speechOutput;
            const intentObj = this.event.request.intent;
            time = intentObj.slots.time.value;
            if (!isNaN(intentObj.slots.time.value)) {
                speechOutput = "Moving backward for " + time + " seconds";
            }
            else{
                speechOutput = "Moving backward";
                time = null;
            }
        
            var request = {
                action: action,
                time: time
            }; 
            publishMessage(callback,request);
        
            this.emit(":ask", speechOutput);
        },
        'TurnIntent': function () {
            var speechOutput, reprompt;
            var direction;
            const action = "turn_";

            const intentObj = this.event.request.intent;
            
            var opts = ["left","right","straight"];
            if (!intentObj.slots.direction.value){
                speechOutput = 'Which direction? Left, right, or straight.';
                reprompt = 'Left, right, or straight';
                this.emit(":elicitSlot", 'direction', speechOutput, reprompt);
            }
            if (opts.includes(intentObj.slots.direction.value)){
                direction = intentObj.slots.direction.value;
                speechOutput = "Turning " + direction;
                var request = {
                    action: action + direction
                }; 
                publishMessage(callback,request);
            }
            else{
                speechOutput = "Invalid direction. Try the command again.";
            }

            this.emit(":ask", speechOutput);
        },
        'HaltIntent': function () {
            const action = 'stop';
            const speechOutput = "Stopping.";
            var request = {
                action: action,
            }; 
            publishMessage(callback,request);
        
            this.emit(":ask", speechOutput);
        },
        'SpeedIntent': function () {
            const action = 'set_speed';
            var speechOutput, reprompt;
            
            const intentObj = this.event.request.intent;
            
            if(!intentObj.slots.speed.value) {
                speechOutput = "Which value for speed?";
                reprompt = "You can set the speed to a value between 0 and 100.";
                this.emit(":elicitSlot", 'speed', speechOutput, reprompt);
            }
            if (!isNaN(intentObj.slots.speed.value)){
                const speed = intentObj.slots.speed.value;
                speechOutput = "Setting speed to " + speed;
                var request = {
                    action: action,
                    speed: speed
                }; 
                publishMessage(callback,request);
            }
            else{
                speechOutput = "Not a number. Try the command again.";
            }
            this.emit(":ask", speechOutput);
        },
        'AMAZON.HelpIntent': function () {
            const speechOutput = HELP_MESSAGE;
            const reprompt = speechOutput;
            reprompt = HELP_REPROMPT;
            this.emit(":ask", speechOutput, reprompt);
        },
        'AMAZON.CancelIntent': function () {
            const speechOutput = STOP_MESSAGE;
            this.emit(":tell", speechOutput);
        },
        'AMAZON.StopIntent': function () {
            const speechOutput = STOP_MESSAGE;
            this.emit(":tell", speechOutput);
        },
    	'Unhandled': function () {
    	    const speechOutput = HELP_REPROMPT;
            this.emit(":ask", speechOutput, speechOutput);
        }
    };
    return handlers;
}

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(buildHandlers(callback));
    alexa.execute();
}; 