#!/bin/bash
mongoimport --username admin --password admin --authenticationDatabase admin --db LineupX --collection Users --type json --file /docker-entrypoint-initdb.d/data/Users.json --jsonArray