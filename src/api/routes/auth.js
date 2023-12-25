import express from 'express';
import User from '../model/user.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../config/mailer.js';
import { signInAccessToken, refreshAccessToken } from '../helper/jwtHelper.js';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import rateLimit from 'express-rate-limit';

const authLimit = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 10,
   message:
      'Too many posts created from this IP, please try again after 15 minutes',
});

const router = express.Router();

/////////////////////////////////////////////////////////////////////////////

router.post('/login', authLimit, async (req, res, next) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
         throw createError.NotFound('Invalid email or password');
      }

      if (user.role != 'admin' && user.email != 'admin@lineupx.net') {
         const isMatch = await user.passwordCheck(password);

         if (!isMatch) {
            throw createError.Unauthorized('Invalid email or password');
         }
      } else {
         const isMatch = password == user.password;
         if (!isMatch) {
            throw createError.Unauthorized('Invalid email or password');
         }
      }

      const accessToken = await signInAccessToken(user.id);
      const refreshToken = await refreshAccessToken(user.id);

      res.send({ accessToken, refreshToken });
   } catch (error) {
      if (error.isJoi === true) {
         return next(createError.badRequest('Invalid email or password'));
      }
      res.status(400).send({
         message: 'Error logging in',
         error: error.message,
      });
   }
});

/////////////////////////////////////////////////////////////////////////////

router.post('/verifyemail/:userId', async (req, res) => {
   const { userId } = req.params;
   const { verificationCode } = req.body;

   try {
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).send({ message: 'User not found' });
      }

      if (user.verificationCode !== verificationCode) {
         return res.status(400).send({ message: 'Invalid verification code' });
      }

      user.Verified = true;
      user.verificationCode = undefined;
      await user.save();

      res.status(200).send({ message: 'Email verified successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
   }
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

router.post('/register', authLimit, async (req, res) => {
   const { userName, email, password } = req.body;

   const existingEmailUser = await User.findOne({ email });
   if (existingEmailUser) {
      return res.status(400).send({ message: 'Email already in use' });
   }

   const existingUsernameUser = await User.findOne({ username: userName });
   if (existingUsernameUser) {
      return res.status(400).send({ message: 'Username already in use' });
   }

   try {
      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      const user = new User({
         role: 'user',
         username: userName,
         email: email,
         password: password,
         likes: [],
         dislikes: [],
         saved: [],
         verificationCode: verificationCode, // Save the verification code in the user's document
      });

      // Save the user with the verification code
      const newUser = await user.save();
      const verificationUrl = `http://${process.env.EMAIL_DOMAIN}/verifyemail?userId=${newUser.id}`;

      // Send email verification code
      await sendEmail(
         email,
         'Verify Your Email',
         `Your verification code is: <b><h2>${verificationCode}</h2></b>. You can also verify your email by clicking on the following link: ${verificationUrl}`,
      );

      // Generate access and refresh tokens
      const accessToken = await signInAccessToken(newUser.id);
      const refreshToken = await refreshAccessToken(newUser.id);

      res.send({ accessToken, refreshToken });
   } catch (error) {
      res.status(400).send({
         message: 'Error registering user',
         error: error.message,
      });
   }
});

/////////////////////////////////////////////////////////////////////////////

router.post('/send-verification-email', async (req, res) => {
   const { userId } = req.body;

   try {
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).send({ message: 'User not found' });
      }

      if (user.Verified) {
         return res.status(400).send({ message: 'User already verified' });
      }

      // Generate a new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      user.verificationCode = verificationCode;
      await user.save();

      const verificationUrl = `http://${process.env.EMAIL_DOMAIN}/verifyemail?userId=${user.id}`;

      // Send email verification code
      await sendEmail(
         user.email,
         'Verify Your Email',
         `Your verification code is: <b><h2>${verificationCode}</h2></b>. You can also verify your email by clicking on the following link: ${verificationUrl}`,
      );

      res.status(200).send({ message: 'Verification email sent' });
   } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
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
      const payload = jwt.verify(
         refreshToken,
         process.env.REFRESH_TOKEN_SECRET,
      );

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

/////////////////////////////////////////////////////////////////////////////

router.post('/resetpassword/:token', async (req, res) => {
   // Extract the token from the URL parameters and the new password from the request body
   const { token } = req.params;
   const { password } = req.body;

   // Find the user with this token
   const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
   });

   if (!user) {
      return res
         .status(400)
         .send('Password reset token is invalid or has expired');
   }

   // Update the user's password and clear the reset token and expiration date
   user.password = password;
   user.resetPasswordToken = undefined;
   user.resetPasswordExpires = undefined;
   await user.save();

   res.status(200).send('Your password has been updated');
});

/////////////////////////////////////////////////////////////////////////////

function generateDefaultPassword(length = 10) {
   const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   for (let i = 0; i < length; i++) {
      result += characters.charAt(
         Math.floor(Math.random() * characters.length),
      );
   }
   return result;
}

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: '/google/callback',
      },

      async (accessToken, refreshToken, profile, done) => {
         try {
            // Check if a user with this Google ID already exists in your database
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
               console.log('User found with googleId:', profile.id);
            } else {
               console.log('No user found with googleId:', profile.id);

               // Check if a user with this email already exists
               const existingUser = await User.findOne({
                  email: profile.emails[0].value,
               });
               if (existingUser) {
                  console.log(
                     'User found with email:',
                     profile.emails[0].value,
                  );

                  // Update the existing user with the Google ID
                  existingUser.googleId = profile.id;
                  user = await existingUser.save();
               } else {
                  console.log(
                     'No user found with email:',
                     profile.emails[0].value,
                  );

                  // If not, create a new user
                  user = new User({
                     googleId: profile.id,
                     username: profile.displayName,
                     email: profile.emails[0].value,
                     password: generateDefaultPassword(),
                     verified: 'true',
                  });

                  await user.save();
               }
            }

            done(null, user);
         } catch (err) {
            done(err);
         }
      },
   ),
);

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   User.findById(id, (err, user) => {
      done(err, user);
   });
});

/////////////////////////////////////////////////////////////////////////////

router.get(
   '/google',
   passport.authenticate('google', { scope: ['profile', 'email'] }),
);

/////////////////////////////////////////////////////////////////////////////

router.get(
   '/google/callback',
   passport.authenticate('google', { failureRedirect: '/login' }),
   async (req, res, next) => {
      try {
         // The user is stored in req.user after successful authentication
         const user = req.user;

         const accessToken = await signInAccessToken(user.id);
         const refreshToken = await refreshAccessToken(user.id);

         res.redirect(
            `http://${process.env.EMAIL_DOMAIN}/google-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
         );
      } catch (error) {
         res.status(400).send({
            message: 'Error logging in',
            error: error.message,
         });
      }
   },
);

export default router;
