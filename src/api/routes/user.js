import express from 'express';
import User from '../model/user.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
   findDuplicateUsername,
   findDuplicateEmail,
} from '../helper/findDuplicateUser.js';
import cloudinary from '../config/cloudinary.js';
import { Formidable } from 'formidable';
import fs from 'fs';

const router = express.Router();
const cloudinaryObject = cloudinary();
// single user login
router.post('/users', async (req, res) => {
   const { accessToken, refreshToken } = req.body;

   if (!accessToken || !refreshToken) {
      return res.status(401).send('Access Denied');
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

router.post('/user/:id/pfp', (req, res) => {
   const form = new Formidable();

   form.maxFileSize = 1 * 1024 * 1024;

   form.parse(req, (err, fields, files) => {
      if (err) {
         console.error('Error parsing the files:', err);
         return res.status(400).send('Error processing the file');
      }

      const file = files.image; // Ensure the key 'image' matches your client-side form

      // Check if the file exists
      if (!file) {
         return res.status(400).send('No file uploaded');
      }

      // Define new path (ensure the 'uploads' directory exists)
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const newPath = path.join(__dirname, file[0].originalFilename);

      // Move the file from the temporary path to the new path
      fs.rename(file[0].filepath, newPath, (err) => {
         // Changed file.filepath to file.path
         if (err) {
            console.error('Error moving the file:', err);
            return res.status(500).send('Error processing the file');
         }

         // Upload the file to Cloudinary
         cloudinaryObject.uploader
            .upload(newPath, {
               folder: 'profile_pictures',
               transformation: [
                  { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
               ],
            })
            .then((uploadResponse) => {
               const userId = req.params.id;

               // Delete the file after it has been uploaded
               fs.unlink(newPath, (err) => {
                  if (err) {
                     console.error('Failed to delete the file:', err);
                     return res.status(500).send('Server error');
                  }

                  // Find the user and update their profile picture URL
                  User.findById(userId)
                     .then((user) => {
                        if (!user) {
                           console.error('User not found');
                           return res.status(404).send('User not found');
                        }

                        user.ProfilePicture = uploadResponse.secure_url;
                        return user.save().then(() => user); // return the user after saving
                     })
                     .then((user) => {
                        // receive the user here
                        res.status(200).json({
                           message: 'Profile picture updated successfully',
                           profilePicture: user.ProfilePicture,
                        });
                     })
                     .catch((err) => {
                        console.error('Failed to update user:', err);
                        res.status(500).send('Server error');
                     });
               });
            })
            .catch((error) => {
               console.error('Failed to upload profile picture:', error);
               res.status(500).send('Server error');
            });
      });
   });
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
