#!/bin/bash

# to add to crontab:
#       chmod 777 backup.sh
#       sudo crontab -e
# choose nano, add this line:
#       * */3 * * * /home/danny/HKMS/foowiki/bin
#
# ^ backs up every 3 hours 
#

# backup directory
DIR=../var

# datetime in ISO 8601 format
DT=$(date +%Y-%m-%dT%H:%M:%S)

# Get the data using CONSTRUCT query in backup.sparql
# http://localhost:3030/foowiki/query?query=[query]
curl -H "Accept: text/turtle" \
     -o $DIR/backup_$DT.ttl \
     --data-urlencode query@backup.sparql \
     http://localhost:3030/foowiki/query
