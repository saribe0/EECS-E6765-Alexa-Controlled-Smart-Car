# EECS-E6765-Alexa-Controlled-Smart-Car
EECS E6765 Internet of Things System and Physical Data Analysis: An Alexa Controlled Smart Car

## Project Outline
With this project, we use an Amazon Echo Dot to control a remote control car. The car can also be controlled through a website or, to a lesser extent, ssh. The system has a few major components: An Alexa Skill, 2 AWS Lambda functions, a website in AWS S3, authentication using AWS Cognito, an api using AWS API Gateway, an MQTT Broker/Topic using AWS IoT, and the car itself. Below digs into each of these in a bit more depth:

### Front-End Control
#### Amazon Alexa via an Echo/Echo Dot
One of the ways our car can be controlled is through an Amazon Echo or Echo Dot. To realize this, we developed an Alexa Skill. When the skill is launched, it lets users say commands which are then handled by a backend AWS Lambda function.

#### Website
Another way our car can be controlled is through a simple website hosted in AWS S3. The website allows users to create/log in to an account using AWS Cognito and assume a role that allows them to interact with an api in AWS API Gateway.

* AWS Cognito handles user accounts - both creation and login/logout. It provides a secure way for users to authenticate with our service and obtain the proper permissions required to make requests to the car.
* The AWS API Gateway ensures that only authenticated requests will be processed. Users who log in with AWS Cognito are provided the proper credentials to make requests to the API. When a request is made, API Gateway validates the user has permission to make the request and then forwards the request to a Lambda function for handling.

### Backend Processing
#### AWS Lambda
Once a request has been made, either through Alexa or the website, it is handled by a Lambda function. Lambda functions offer a scalable compute microservice. In our case, our functions parse the request made through Alexa or the website and formulate an MQTT message with the request parameters. The function then publishes the request to an MQTT topic which allows it to be recieved by the car and acted upon.

#### MQTT Broker/Topic
Interfacing between the backend processing and the car is an MQTT broker and topic implemented using AWS IoT. First, we registered our car with AWS IoT and then set it up to subscribe to an MQTT topic. When messages are published to this topic by Lambda functions, the car recieves them and can act accordingly. The topic itself is handled by AWS IoT and proper AWS IAM roles are required to publish messages to it. The car is able to authenticate with AWS IoT and subscribe to the topic using certificates and public/private key encryption. 
</br></br>
Originally, we had planned to send commands to the car through either a website hosted on the Pi or a RESTful API hosted on the Pi. The issue with this is that whenever the car is turned on, it connects to a dynamic IP address. Though we have it set up that the car emails us it's IP at startup, manually entering the IP to the backend Lambda functions or a web browser does not make sense. By using MQTT, the car reaches out to the topic which, since it's hosted in AWS, is statically located. The car can then recieve any messages that are posted to the topic regardless of where they're posted from.  

### Car
#### Hardware
The car hardware comes from a SunFounder kit which includes a chassis, motors, motor control boards, and power managment boards. The kit is designed to be used with a Raspberry Pi which is the brains of the car - more on this below.

#### Software
When the car is turned on, it waits for the OS to initialize and then automatically subscribes to an MQTT topic and initializes the driving interface. AWS IoT provides some sample code which we modified to fit our needs. The code subscribes to the topic and logs MQTT interactions to a log file. When a command is recieved, it calls a function which parses the command and determines the necessary action to take. This is then executed and the car moves.

## Resources
#### Alexa Integration 
https://developer.amazon.com/docs/smarthome/understand-the-smart-home-skill-api.html</br>
https://developer.amazon.com/docs/smarthome/steps-to-build-a-smart-home-skill.html</br>
https://developer.amazon.com/alexa/smart-home/learn

#### AWS API Gateway
https://aws.amazon.com/api-gateway/</br>
https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html

#### Raspberry Pi/Car
https://www.raspberrypi.org/downloads/ </br>
https://www.amazon.com/SunFounder-Raspberry-Graphical-Programming-Electronic/dp/B06XWSVLL8/ref=pd_sim_21_3?_encoding=UTF8&pd_rd_i=B06XWSVLL8&pd_rd_r=B1NR6J3G3KG63S8NJY59&pd_rd_w=5m7Pa&pd_rd_wg=PeALN&psc=1&refRID=B1NR6J3G3KG63S8NJY59

#### Security
[CA and SSL Certs] https://www.wikihow.com/Be-Your-Own-Certificate-Authority

