import express from 'express';
import postData from '../model/postData.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const cloudinaryObject = cloudinary();

router.get('/post', (req, res) => {});

router.post('/post', async (req, res) => {
   const {
      postName,
      mapName,
      standingPosition,
      aimingPosition,
      landingPosition,
      grenadeType,
      jumpThrow,
      user,
   } = req.body;

   const JumpThrow = jumpThrow == 'true' ? true : false;

   try {
      // Add valo support later
      const uploadStandingPostion = await cloudinaryObject.uploader.upload(
         standingPosition,
         {
            folder: 'CS',
         },
      );
      const uploadAimingPostion = await cloudinaryObject.uploader.upload(
         aimingPosition,
         {
            folder: 'CS',
         },
      );
      const uploadLandingPostion = await cloudinaryObject.uploader.upload(
         landingPosition,
         {
            folder: 'CS',
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
            url: uploadStandingPostion.secure_url,
         },
         aimingPosition: {
            public_id: uploadAimingPostion.public_id,
            url: uploadAimingPostion.secure_url,
         },
         landingPosition: {
            public_id: uploadLandingPostion.public_id,
            url: uploadLandingPostion.secure_url,
         },
         grenadeType: grenadeType,
         jumpThrow: JumpThrow,
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
