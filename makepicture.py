import picamera
import sys
import time
from fractions import Fraction


# camera = picamera.PiCamera()
path = 'htdocs/images/output';
if len(sys.argv) > 1:
    path = sys.argv[1]


now = time.strftime("%m-%d-%Y_%H-%M")
print(now);


with picamera.PiCamera() as camera:
    # camera.sharpness = 0
    # camera.contrast = 0
    # camera.brightness = 55
    # camera.saturation = 0
    # camera.framerate = Fraction(1, 6)

    # camera.video_stabilization = False
    # camera.exposure_compensation = 0
    # camera.exposure_mode = 'auto'
    # camera.meter_mode = 'average'
    # camera.awb_mode = 'auto'
    # camera.image_effect = 'none'
    # camera.color_effects = None
    # camera.rotation = 0
    # camera.hflip = True
    # camera.vflip = False
    # camera.crop = (0.0, 0.0, 1.0, 1.0)
    
    camera.resolution = (2592, 1944)
    # camera.framerate = Fraction(1, 6)
    camera.framerate = 2
    camera.shutter_speed = 800000
    camera.exposure_mode = 'off'
    camera.iso = 800



    # Now fix the values
    # camera.shutter_speed = camera.exposure_speed
    # g = camera.awb_gains
    # camera.awb_mode = 'off'
    # camera.awb_gains = g



    # camera.start_preview()
    # Camera warm-up time
    time.sleep(5)

    camera.capture(path + '/image_' + now + '.jpg')


