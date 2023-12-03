import express from 'express';
import User from '../model/user.js';
import createError from 'http-errors';

import { signInAccessToken, refreshAccessToken } from '../helper/jwtHelper.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
         throw createError.NotFound("Invalid email or password");
      }

      const isMatch = await user.passwordCheck(password);

      if (!isMatch) {
         throw createError.Unauthorized("Invalid email or password");
      }    

      const accessToken = await signInAccessToken(user.id);
      const refreshToken = await refreshAccessToken(user.id);

      res.send({accessToken, refreshToken});
   } catch (error) {
      if (error.isJoi === true) { return next(createError.badRequest("Invalid email or password")); }
      res.status(400).send({ message: 'Error logging in', error: error.message });
   }
});

export default router;