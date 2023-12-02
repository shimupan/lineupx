import express from 'express';
import User from '../model/user.js';
import { signInAccessToken, refreshAccessToken } from '../helper/jwtHelper.js';
import { sendEmail } from '../model/mailer.js'; 

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

    // Generate email verification token
    const emailVerificationToken = user.generateVerificationToken();
    
    // Save the user with the verification token
    const newUser = await user.save();

    // Send email verification link
    const verificationUrl = `http://<your-domain>/verify-email/${emailVerificationToken}`;
    await sendEmail(email, 'Verify Your Email', `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`);

    // Generate access and refresh tokens
    const accessToken = await signInAccessToken(newUser.id);
    const refreshToken = await refreshAccessToken(newUser.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).send({ message: 'Error registering user', error: error.message });
  }
});

export default router;
