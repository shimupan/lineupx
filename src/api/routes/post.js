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
         UserID: user._id,
         postTitle: postName,
         mapName: mapName,
         /*
         TODO: Forgot to add the following to the form
         lineupLocation: lineupLocation,
         lineupDescription: lineupDescription,
         teamSide: teamSide,
         */
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

export default router;
