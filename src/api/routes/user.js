import express from 'express';
import User from '../model/user.js';
import jwt from 'jsonwebtoken';
import { findDuplicateUsername, findDuplicateEmail } from '../helper/findDuplicateUser.js';

const router = express.Router();

// single user login
router.get('/users', async (req, res) => {
   const accessToken = req.headers.accesstoken;
   const refreshToken = req.headers.refreshtoken;
   if (!accessToken || !refreshToken) {
      res.status(401).send('Access Denied');
   }

   const decoded = jwt.decode(accessToken);
   const user = await User.findOne({ _id: decoded.aud });

   if (!user) {
      res.status(404).send('User not found');
   } else {
      res.send(user);
   }
});

// getting a specific user by username
router.get('/user/:id', async (req, res) => {
   const username = req.params.id;
   const user = await User.findOne({ username: username });
   if (!user) {
      res.status(404).send('User not found');
   } else {
      res.send(user);
   }
});

// getting a specific user by id
router.get('/user/id/:id', async (req, res) => {
   const id = req.params.id;
   const user = await User.findOne({ _id: id });
   if (!user) {
      res.status(404).send('User not found');
   } else {
      res.send(user);
   }
});

// getting all users
router.post('/user', async (req, res) => {
   const { role } = req.body;
   if (role != 'admin') {
      return res.status(401).send('Unauthorized');
   }
   try {
      const users = await User.find();
      return res.send(users);
   } catch (error) {
      return res.status(404).send('Users not found');
   }
});

router.post('/user/:id/comment', async (req, res) => {
   const { id } = req.params;
   const { userId, text, postId } = req.body;

   if (!text) {
      return res.status(400).send('Comment text is required');
   }

   try {
      const user = await User.findById(id);

      if (!user) {
         return res.status(404).send('User not found');
      }

      const comment = {
         user: userId,
         text: text,
         post: postId,
      };

      user.comments.push(comment);
      await user.save();

      res.status(200).send(user);
   } catch (error) {
      console.error('Failed to add comment:', error);
      res.status(500).send('Server error');
   }
});

router.post('/user/update', async (req, res) => {
   const { user, newUsername, newEmail } = req.body;
   
   try {
      const userUpdate = await User.findById(user._id);

      if (!userUpdate) {
         return res.status(400).json({
            message: 'Error Processing User',
            type: 'error',
         });
      }

      if (newUsername != userUpdate.username) {
         if (newUsername.length < 3) {
            return res.status(400).json({
               message: 'Username must be at least 3 characters long',
               type: 'error',
            });
         }
         const isDuplicate = await findDuplicateUsername(newUsername);
         if (isDuplicate) {
            return res.status(400).json({
               message: 'Username already exists',
               type: 'error',
            });
         }
         userUpdate.username = newUsername;
      }

      if (newEmail != userUpdate.email) {
         const isDuplicate = await findDuplicateEmail(newEmail);
         if (isDuplicate) {
            return res.status(400).json({
               message: 'Email already exists',
               type: 'error',
            });
         }
         userUpdate.email = newEmail;
         userUpdate.Verified = false;
      }

      await userUpdate.save();

      res.status(200).json({
         message: 'Updated successfully',
         type: 'success',
      });
   } catch (error) {
      console.error('Failed to update user:', error);
      res.status(200).json({
         message: 'Error updating user',
         type: 'error',
      });
   }
});

export default router;
