import express from 'express';
import User from '../model/user.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../model/mailer.js';
import { signInAccessToken, refreshAccessToken } from '../helper/jwtHelper.js';

dotenv.config();
const router = express.Router();

/////////////////////////////////////////////////////////////////////////////

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

// Define your route using router, not app
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ 
    emailVerificationToken: token, 
    emailVerificationTokenExpires: { $gt: Date.now() } 
  });

  if (!user) {
    return res.status(400).send('Token is invalid or has expired');
  }

  user.Verified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  res.send('Email verified successfully');
});

/////////////////////////////////////////////////////////////////////////////

router.delete('/logout', async (req, res) => {
  try {
  const { refreshToken } = req.body;
  if(!refreshToken) throw createError.BadRequest();
  //TODO AFTER VERIFY REFRESH TOKEN IS IMPLEMENTED
  }catch (err){
  next(err);
  }
});

/////////////////////////////////////////////////////////////////////////////

router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ message: 'Email already in use' });
  }

  try {
    const user = new User({
      username: userName,
      email: email,
      password: password,
      likes: [],
      dislikes: [],
      saved: []
    });
    
    // Save the user with the verification token
    const newUser = await user.save();
    const emailVerificationToken = user.generateVerificationToken();
    // Send email verification link
    //const verificationUrl = `http://localhost:3000/verify-email/${emailVerificationToken}`;
    const verificationUrl = `http://${process.env.EMAIL_DOMAIN}/verify-email/${emailVerificationToken}`;
    await sendEmail(email, 'Verify Your Email', `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`);

    // Generate access and refresh tokens
    const accessToken = await signInAccessToken(newUser.id);
    const refreshToken = await refreshAccessToken(newUser.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).send({ message: 'Error registering user', error: error.message });
  }
});

/////////////////////////////////////////////////////////////////////////////





export default router;
