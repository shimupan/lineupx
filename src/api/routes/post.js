import express from 'express';
import mongoose from 'mongoose';
import PostDataSchema from '../model/postData.js';
import cloudinary from '../config/cloudinary.js';
import rateLimit from 'express-rate-limit';

const postLimit = rateLimit({
   windowMs: 24 * 60 * 60 * 1000,
   max: 10,
   message: 'Too many uploads, try again in 1 Day',
});

const router = express.Router();

const cloudinaryObject = cloudinary();

// Find all post for a specific user
router.get('/post/:game/:id', (req, res) => {
   const { game, id } = req.params;

   const PostData = mongoose.model('PostData', PostDataSchema, game);
   PostData.find({
      UserID: new mongoose.Types.ObjectId(id),
      approved: true,
   })
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         res.send(err);
      });
});

// Find all post for a specific game
router.get('/post/:game', (req, res) => {
   const { game } = req.params;

   const PostData = mongoose.model('PostData', PostDataSchema, game);
   PostData.find({ approved: true })
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         res.send(err);
      });
});

// Allow authorized users to get all unapproved posts
router.post('/post/check', async (req, res) => {
   const { role } = req.body;
   if (role != 'admin') {
      return res.status(401).send('Unauthorized');
   }
   const CS2Data = mongoose.model('PostData', PostDataSchema, 'CS2');
   const VALData = mongoose.model('PostData', PostDataSchema, 'Valorant');
   const CS2Posts = await CS2Data.find({ approved: false });
   const VALPosts = await VALData.find({ approved: false });
   res.status(200).send([CS2Posts, VALPosts]);
});

// Delete or approve a post
router.post('/post/:status', async (req, res) => {
   const { id, status, game, role } = req.body;

   if (role != 'admin') {
      return res.status(401).send('Unauthorized');
   }
   const PostData = mongoose.model('PostData', PostDataSchema, game);
   if (status === 'approve') {
      PostData.findByIdAndUpdate(id, { approved: true }, { new: true })
         .then((data) => {
            res.status(200).send(data);
         })
         .catch((err) => {
            res.status(404).send(err);
         });
   }

   if (status === 'reject') {
      try {
         const post = await PostData.findById(id);
         if (post) {
            const deletePosts = await cloudinaryObject.api.delete_resources(
               [
                  post.aimingPosition.public_id,
                  post.standingPosition.public_id,
                  post.landingPosition.public_id,
               ],
               { type: 'upload', resource_type: 'image' },
            );
            console.log(deletePosts);

            PostData.findByIdAndDelete(id)
               .then((data) => {
                  return res.status(200).send(data);
               })
               .catch((err) => {
                  return res.status(404).send(err);
               });
         } else {
            return res.status(404).send('Post not found');
         }
      } catch (error) {
         console.log(error);
      }
   }
});

// Upload a post
router.post('/post', postLimit, async (req, res) => {
   const {
      postName,
      mapName,
      standingPosition,
      aimingPosition,
      landingPosition,
      grenadeType,
      jumpThrow,
      game,
      user,
      lineupLocation,
      lineupDescription,
      teamSide,
      valorantAgent,
      ability,
   } = req.body;

   const createModel = (collectionName) =>
      mongoose.model('PostData', PostDataSchema, collectionName);
   const postData = createModel(game);

   const JumpThrow = jumpThrow == 'true' ? true : false;

   try {
      // Add valo support later
      const uploadStandingPostion = await cloudinaryObject.uploader.upload(
         standingPosition,
         {
            folder: game,
         },
      );
      const uploadAimingPostion = await cloudinaryObject.uploader.upload(
         aimingPosition,
         {
            folder: game,
         },
      );
      const uploadLandingPostion = await cloudinaryObject.uploader.upload(
         landingPosition,
         {
            folder: game,
         },
      );

      const newPost = new postData({
         Username: user.username,
         UserID: user._id,
         postTitle: postName,
         mapName: mapName,
         lineupLocation: lineupLocation,
         lineupDescription: lineupDescription,
         teamSide: teamSide,
         likes: [],
         dislikes: [],
         views: 0,
         standingPosition: {
            public_id: uploadStandingPostion.public_id,
            asset_id: uploadStandingPostion.asset_id,
         },
         aimingPosition: {
            public_id: uploadAimingPostion.public_id,
            asset_id: uploadAimingPostion.asset_id,
         },
         landingPosition: {
            public_id: uploadLandingPostion.public_id,
            asset_id: uploadLandingPostion.asset_id,
         },
         grenadeType: grenadeType,
         jumpThrow: JumpThrow,
         game: game,
         approved: false,
         valorantAgent: valorantAgent,
         ability: ability,
      });

      const savedPost = await newPost.save();

      if (!savedPost) {
         res.status(404).send('Post not saved');
      } else {
         console.log(savedPost);
         res.status(200).send({ message: 'Post Saved', data: savedPost });
      }
   } catch (error) {
      console.log(error);
      res.send(error);
   }
});

// Increment view count for a specific post
router.post('/post/:id/increment-view-count', async (req, res) => {
   const PostData = mongoose.model('PostData', PostDataSchema);
   const { id } = req.params;

   try {
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }

      post.views += 1;
      await post.save();

      res.send(post);
   } catch (error) {
      console.error('Failed to increment view count:', error);
      res.status(500).send('Server error');
   }
});


export default router;
