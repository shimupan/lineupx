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

router.delete('/logout', async (req, res, next) => {
  try {
    // Extract the refresh token from the request body
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error('Refresh token is required for logout');
    }
    // Acknowledge the logout
    res.send({ message: 'Successfully logged out' });
  } catch (err) {
    // Pass any errors to the error-handling middleware
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

router.get("/users", async (req, res) => {
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

router.post('/refresh-token', async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send('Refresh Token is required');
  }

  try {
    // Verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Assuming payload contains user ID
    const userId = payload.aud;

    // Generate a new access token
    const newAccessToken = await signInAccessToken(userId);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).send('Invalid Refresh Token');
  }
});



export default router;
