import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { login, register, logout } from './routes/index.js';
import User from './model/user.js';

dotenv.config();
// Use environment variables for sensitive information
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (db) => {
    console.log('database connected');
    const collections = await db.connection.db.listCollections().toArray();
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
app.use(logout);

// TESTING USERS ROUTE
app.get("/users", async (req, res) => {
  const accessToken = req.headers.accesstoken;
  const refreshToken = req.headers.refreshtoken;
  if (!accessToken || !refreshToken) {
    res.status(401).send("Access Denied");
  }

  const decoded = jwt.decode(accessToken);
  const user = await User.findOne({ _id: decoded.aud });

  if (!user) {
    res.status(404).send('User not found');
  } else {
    res.send(user);
  }
});

const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
