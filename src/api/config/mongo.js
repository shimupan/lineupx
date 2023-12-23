import mongoose from 'mongoose';

const mongo = () => {
   mongoose
      .connect(
         process.env.MONGO_URI ||
            'mongodb://admin:admin@lineupx_db:27017/LineupX',
      )
      .then(async (db) => {
         console.log('database connected');
         const collections = await db.connection.db.listCollections().toArray();
      })
      .catch((err) => console.log('Database connection error: ', err));
};

export default mongo;
