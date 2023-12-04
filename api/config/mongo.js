import mongoose from 'mongoose';

const mongo = () => {mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (db) => {
    console.log('database connected');
    const collections = await db.connection.db.listCollections().toArray();
  })
  .catch(err => console.log('Database connection error: ', err));};

export default mongo;