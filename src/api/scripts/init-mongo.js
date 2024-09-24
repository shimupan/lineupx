db.createUser({
   user: 'admin',
   pwd: 'admin',
   roles: [
      {
         role: 'readWrite',
         db: 'LineupX',
      },
   ],
});

db = db.getSiblingDB('LineupX');
db.createCollection('Users');
