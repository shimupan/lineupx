import express from 'express';
import User from '../model/user.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../config/mailer.js';
import { signInAccessToken, refreshAccessToken } from '../helper/jwtHelper.js';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

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

/////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('User with this email does not exist');
  }

  const token = crypto.randomBytes(20).toString('hex');

  // Save the token in your database and associate it with the user
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const mailOptions = {
    to: user.email,
    from: 'passwordreset@example.com',
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      http://${process.env.EMAIL_DOMAIN}/resetpassword?token=${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  // Use your sendEmail function
  await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.text);

  res.status(200).send('Password reset email sent');
});

router.post('/resetpassword/:token', async (req, res) => {
  // Extract the token from the URL parameters and the new password from the request body
  const { token } = req.params;
  const { password } = req.body;

  // Find the user with this token
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

  if (!user) {
    return res.status(400).send('Password reset token is invalid or has expired');
  }

  // Update the user's password and clear the reset token and expiration date
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).send('Your password has been updated');
});


/////////////////////////////////////////////////////////////////////////////

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  // Check if a user with this Google ID already exists in your database
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    // If not, create a new user
    user = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value
      // You can add more fields here if needed
    });

    await user.save();
  }

  done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

export default router;