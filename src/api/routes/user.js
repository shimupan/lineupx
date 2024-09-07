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
   const user = await User.findOne({ username: username }).select('-email -password');
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

// getting a specific user by
router.get('/users/ids', async (req, res) => {
   const ids = req.query.ids.split(',');
   try {
      const users = await User.find({ _id: { $in: ids } });
      if (users.length === 0) {
         res.status(404).send('No users found');
      } else {
         res.send(users);
      }
   } catch (error) {
      res.status(500).send('Server error');
   }
});

// Update user information
router.patch('/user/:id', async (req, res) => {
   const { id } = req.params;
   const updateData = req.body;

   try {
      const user = await User.findById(id);

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Update only the fields that are provided in the request body
      Object.keys(updateData).forEach((key) => {
         if (user[key] !== undefined) {
            user[key] = updateData[key];
         }
      });

      await user.save();

      res.status(200).json({ message: 'User updated successfully', user });
   } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
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

router.delete('/user/:id/comment/:commentId', async (req, res) => {
   const { id, commentId } = req.params;

   try {
      const user = await User.findById(id);

      if (!user) {
         return res.status(404).send('User not found');
      }

      const commentIndex = user.comments.findIndex(
         (comment) => comment._id.toString() === commentId,
      );

      if (commentIndex === -1) {
         return res.status(404).send('Comment not found');
      }

      user.comments.splice(commentIndex, 1);

      await user.save();

      res.status(200).send('Comment deleted successfully from user');
   } catch (error) {
      console.error('Error deleting comment from user:', error);
      res.status(500).send('Server error');
   }
});

router.put('/user/:id/comment/:commentId', async (req, res) => {
   const { id, commentId } = req.params;
   const { text } = req.body;

   if (!text) {
      return res.status(400).send('Comment text is required');
   }

   try {
      const user = await User.findById(id);

      if (!user) {
         return res.status(404).send('User not found');
      }

      const commentIndex = user.comments.findIndex(
         (comment) => comment._id.toString() === commentId,
      );

      user.comments[commentIndex].text = text;
      await user.save();

      res.status(200).send('Comment edited successfully');
   } catch (error) {
      console.error('Error editing comment:', error);
      res.status(500).send('Internal Server Error');
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

// follow/unfollow a user
router.post('/user/:id/follow', async (req, res) => {
   const { id } = req.params; // id of the user who wants to follow/unfollow someone
   const { userIdToFollow } = req.body; // id of the user who is to be followed/unfollowed

   if (!userIdToFollow) {
      return res.status(400).send('User ID to follow/unfollow is required');
   }

   try {
      const userToFollow = await User.findById(id);
      const user = await User.findById(userIdToFollow);

      if (!user || !userToFollow) {
         return res.status(404).send('User not found');
      }

      const isFollowing = user.following.some(
         (followingId) =>
            followingId.toString() === userToFollow._id.toString(),
      );
      if (isFollowing) {
         // unfollow the user
         user.following = user.following.filter(
            (followingId) =>
               followingId &&
               followingId.toString() !== userToFollow._id.toString(),
         );
         userToFollow.followers = userToFollow.followers.filter(
            (followerId) =>
               followerId && followerId.toString() !== user._id.toString(),
         );
      } else {
         // follow the user
         user.following.push(id);
         userToFollow.followers.push(userIdToFollow);
      }

      await user.save();
      await userToFollow.save();

      res.status(200).send(user);
   } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
      res.status(500).send('Server error');
   }
});

// Save a post for a user
router.post('/user/:userId/save-post', async (req, res) => {
   const { userId } = req.params;
   const { postId } = req.body;

   try {
      const user = await User.findById(userId);

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Check if the post is already saved
      const postIndex = user.saved.indexOf(postId);

      if (postIndex !== -1) {
         // If the post is already saved, remove it
         user.saved.splice(postIndex, 1);
         await user.save();
         return res.status(200).json({ message: 'Post removed from saved' });
      } else {
         // If the post is not saved, add it
         user.saved.push(postId);
         await user.save();
         return res.status(200).json({ message: 'Post saved successfully' });
      }
   } catch (error) {
      console.error('Failed to save or remove post:', error);
      res.status(500).json({ message: 'Server error' });
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

// getting multiple users by ids
router.post('/users/multiple', async (req, res) => {
   const ids = req.body.ids;
   if (!Array.isArray(ids)) {
      return res.status(400).send('Invalid request');
   }
   try {
      const users = await User.find({
         _id: { $in: ids },
      });
      if (!users.length) {
         return res.status(404).send('Users not found');
      }
      return res.send(users);
   } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
   }
});

export default router;
