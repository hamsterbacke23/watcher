#!/usr/bin/python
import sys
import os
import json
import Adafruit_DHT

# Parse command line parameters.
sensor_args = { '11': Adafruit_DHT.DHT11,
        '22': Adafruit_DHT.DHT22,
        '2302': Adafruit_DHT.AM2302 }
if len(sys.argv) == 3 and sys.argv[1] in sensor_args:
  sensor = sensor_args[sys.argv[1]]
  pin = sys.argv[2]
else:
  print 'usage: sudo ./Adafruit_DHT.py [11|22|2302] GPIOpin#'
  print 'example: sudo ./Adafruit_DHT.py 2302 4 - Read from an AM2302 connected to GPIO #4'
  sys.exit(1)

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)


if humidity is not None and temperature is not None:
  humidity = '{0:0.1f}'.format(humidity)
  temperature = '{0:0.1f}'.format(temperature)

  data = {
    'temperature' : temperature,
    'humidity': humidity
  }
  print json.dumps(data);
  sys.stdout.flush()

else:
  print 'Failed to get reading. Try again!'
  sys.exit(1)
