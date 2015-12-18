#!/bin/bash
#shift

cd "$(dirname "$0")"
python makePicture.py $@

/usr/local/bin/node /srv/www/watcher/app/resizeImages.js
/usr/local/bin/node /srv/www/watcher/app/readImages.js
