import express from 'express';

import User from '../model/user.js';
import { signInAccessToken, refreshAccessToken } from '../helper/jwtHelper.js';

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
      const newUser = await user.save();
      const accessToken = await signInAccessToken(newUser.id);
      const refreshToken = await refreshAccessToken(newUser.id);
      res.send({accessToken, refreshToken});
   } catch (error) {
      res.status(400).send({ message: 'Error registering user', error: error.message });
   }
});
 
export default router;