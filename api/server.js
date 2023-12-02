import dotenv from 'dotenv';
import express from 'express';
import register from './routes/register.js';
import login from './routes/login.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

// Use environment variables for sensitive information
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (db) => {
    console.log('database connected');
    const collections = await db.connection.db.listCollections().toArray();
    console.log(collections);
  })
  .catch(err => console.log('Database connection error: ', err));

const app = express();
app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(register);
app.use(login);

const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
