'''
**********************************************************************
* Filename    : views
* Description : views for server
* Author      : Cavon
* Brand       : SunFounder
* E-mail      : service@sunfounder.com
* Website     : www.sunfounder.com
* Update      : Cavon    2016-09-13    New release
**********************************************************************
'''

from time import sleep
from picar import back_wheels, front_wheels
from django.http import HttpResponse
import picar

# Global Variabls
SPEED = 30
VALID_ACTIONS = set(["forward", "backward", "stop", "set_speed", "turn_right", "turn_left", "turn_straight"])

# Car Setup
picar.setup()
db_file = "/home/pi/SunFounder_PiCar-V/remote_control/remote_control/driver/config"
fw = front_wheels.Front_Wheels(debug=False, db=db_file)
bw = back_wheels.Back_Wheels(debug=False, db=db_file)
bw.ready()
fw.ready()

# Maintain the state of the car
carIsMoving = False


# Handle Incoming Requests for Errors
def run(request):
    global SPEED
    
    # Handle speed updates
    if 'speed' in request:
        speedl = int(request['speed'])
        if speedl > 100:
            speedl = 100
        if speedl < 0:
            speedl = 0
        SPEED = speedl

    # Handle time requests
    time = None
    if 'time' in request:
        time = request['action']

    # Handle action requests
    if 'action' in request:
        action = request['action']
        
        # Make sure the action is valid
        if action not in VALID_ACTIONS:
            return "Not a valid action"

    # Preform the action
    return executeCommand(action, time)


# Actually Execute The Commands
def executeCommand(action, time=None):
    
    global SPEED
    global carIsMoving

    # Move car forwards
    if action == 'backward':
        carIsMoving = True
        bw.speed = SPEED
        bw.forward()
        if time:
            sleep(time)
            bw.stop()

    # Move car backwards
    elif action == 'forward':
        carIsMoving = True
        bw.speed = SPEED
        bw.backward()
        if time:
            sleep(time)
            bw.stop()

    # Stop car
    elif action == 'stop':
        carIsMoving = False
        bw.stop()

    # Turn left
    elif action == 'turn_left':
        fw.turn_left()

    # Turn right
    elif action == 'turn_right':
        fw.turn_right()
    
    # Turn straight
    elif action == 'turn_straight':
        fw.turn_straight()
    
    # Set speed
    elif action == 'set_speed' and carIsMoving:
        bw.speed = SPEED


    return "Command Executed"
