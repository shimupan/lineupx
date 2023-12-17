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
db.Users.insert({
   role: 'admin',
   username: 'admin',
   password: 'admin',
   email: 'admin@lineupx.net',
   Verified: true,
   likes: [],
   dislikes: [],
   saved: [],
});
