import express from 'express';
import User from '../model/user.js'; // Adjust the import path as necessary

const router = express.Router(); // Create a router instance

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

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  res.send('Email verified successfully');
});

export default router; // Export the router
