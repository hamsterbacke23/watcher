#!/usr/bin/python -u

import picamera
import sys
import time
import datetime
from fractions import Fraction
import os
import json

class makePicture:

  dayStart = "21:00"
  dayEnd = "14:00"

  def setStartEndTimes(self):
    currentFilepath = os.path.dirname(os.path.realpath(__file__));
    self.dayStart = self.pkgdata['startPhotoTime']
    self.dayEnd = self.pkgdata['endPhotoTime']


  def timeInRange(self, start, end):
    now = datetime.datetime.now().time()
    if start <= end:
      return start <= now <= end
    else:
      return start <= now or now <= end

  # Restricts picture taking to a certain time
  def checkDayTime(self):
    self.setStartEndTimes()

    startParts = self.dayStart.split(':')
    endParts = self.dayEnd.split(':')

    start = datetime.time(int(startParts[0]), int(startParts[1]), 0);
    end = datetime.time(int(endParts[0]), int(endParts[1]), 0);

    return self.timeInRange(start, end);

  # Get it on!
  def __init__(self):

    force = len(sys.argv) > 1 and sys.argv[1] == '-f'

    self.setPackageData();

    if not force and not self.checkDayTime():
      print json.dumps({'message' : 'Not in time range, exiting!'})
      sys.exit(0)
      return


    filePath = self.getFilePath()
    if (self.takePicture(filePath)):
      print json.dumps({'message' : 'Photo success!'})
      sys.stdout.flush()
      return

  def setPackageData(self):
    self.basePath = os.path.abspath(__file__ + '/../../');
    with open(self.basePath + '/../package.json') as data_file:
      pjson = json.load(data_file)
      self.pkgdata = pjson['watcher']

  def getFilePath(self):

    # camera = picamera.PiCamera()
    path = self.basePath + '/..' + self.pkgdata['publicPath'] + '/' + self.pkgdata['imageoutPathrel'] + '/new';
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
      camera.shutter_speed = 3500

      # Camera warm-up time
      time.sleep(5)

      now = time.strftime("%m-%d-%Y_%H")
      camera.capture(filePath + '/image_' + now + '.jpg')

      return True



pic = makePicture()
