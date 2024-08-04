#!/bin/bash
mongoimport --username admin --password admin --authenticationDatabase admin --db LineupX --collection Users --type json --file /docker-entrypoint-initdb.d/data/Users.json --jsonArray
mongoimport --username admin --password admin --authenticationDatabase admin --db LineupX --collection CS2 --type json --file /docker-entrypoint-initdb.d/data/CS2.json --jsonArray
mongoimport --username admin --password admin --authenticationDatabase admin --db LineupX --collection Valorant --type json --file /docker-entrypoint-initdb.d/data/Valorant.json --jsonArray