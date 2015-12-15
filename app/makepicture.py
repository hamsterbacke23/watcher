#!/usr/bin/python

import picamera
import sys
import time
import datetime
from fractions import Fraction
import os
import json

class makePicture:

  dayStart = 21
  dayEnd = 14

  # Restricts picture taking to a certain time
  def checkDayTime(self):
    timestamp = datetime.datetime.now().time() # Throw away the date information
    time.sleep(1)
    dayStartTime = datetime.time(self.dayStart)
    nightEndTime = datetime.time(23,59)
    nightStartTime = datetime.time(0)
    dayEndTime = datetime.time(self.dayEnd)

    if not(dayStartTime <= timestamp <= nightEndTime) and not (nightStartTime <= timestamp <= dayEndTime):
      return False

    return True

  # Get it on!
  def __init__(self):

    force = len(sys.argv) > 1 and sys.argv[1] == '-f'

    if not force and not self.checkDayTime():
      print('Not in time range, exiting')
      return

    self.setPackageData();

    filePath = self.getFilePath()
    if (self.takePicture(filePath)):
      print('Success!')

  def setPackageData(self):
    self.currentFilepath = os.path.dirname(os.path.realpath(__file__));

    with open(self.currentFilepath + '/../package.json') as data_file:
      self.pkgdata = json.load(data_file)

  def getFilePath(self):

    # camera = picamera.PiCamera()
    path = self.currentFilepath + '/..' + self.pkgdata['publicPath'] + '/' + self.pkgdata['imageoutPathrel'] + '/new';
    if len(sys.argv) > 2:
        path = sys.argv[2]

    return path

  def takePicture(self, filePath):
    with picamera.PiCamera() as camera:
      sizes = self.pkgdata['resizeSizes']
      for val in sizes:
        if(val['key'] == 'big'):
          sizeX = val['x'];
          sizeY = val['y'];

      camera.resolution = (sizeX, sizeY)
      # camera.framerate = Fraction(1, 6)
      # camera.framerate = 2
      camera.shutter_speed = 3500
      # camera.exposure_mode = 'sports'
      # camera.iso = 300

      # Camera warm-up time
      time.sleep(5)

      now = time.strftime("%m-%d-%Y_%H")
      camera.capture(filePath + '/image_' + now + '.jpg')

      return True



pic = makePicture()
