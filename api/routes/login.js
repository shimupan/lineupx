import express from 'express';
import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
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

export default router;