import express from 'express';
import User from '../model/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
   const { email, password } = req.body;
   const existingUser = await User.findOne({ email });
   if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' });
   }

   try {
      const user = new User({
         email: email,
         password: password,
         likes: [],
         dislikes: [],
         saved: []
      });
      await user.save();
      res.status(201).send({ message: 'User registered successfully' });
   } catch (error) {
      res.status(400).send({ message: 'Error registering user', error: error.message });
   }
});
 
export default router;