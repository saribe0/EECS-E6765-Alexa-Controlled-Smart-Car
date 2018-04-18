
MQTT_HANDLER=/home/pi/EECS-E6765-Alexa-Controlled-Smart-Car/Raspberry-Pi-Source/Controller/mqttHandler.py
MQTT_ENDPOINT=a3uqiy2b4yzpan.iot.us-east-1.amazonaws.com
MQTT_TOPIC=car_controller
AUTH_PATH=/home/pi/PiCarAuth

# run pub/sub sample app using certificates downloaded in package
python $MQTT_HANDLER -e $MQTT_ENDPOINT -r $AUTH_PATH/root-CA.crt -c $AUTH_PATH/PiCar.cert.pem -k $AUTH_PATH/PiCar.private.key -t $MQTT_TOPIC
