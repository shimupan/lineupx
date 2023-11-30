import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './model/user.js';
import mongoose from 'mongoose';
import cors from 'cors';
dotenv.config();

// Use environment variables for sensitive information
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error: ', err));

const app = express();
app.use(express.json());
app.use(cors()); 
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ message: 'Email already in use' });
  }

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    // Debugging: Log the retrieved hashed password
    console.log("Hashed password (from DB):", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    // Debugging: Log the result of the password comparison
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }    

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error: error.message });
  }
});

const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
