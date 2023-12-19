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
      user,
   } = req.body;
   console.log(user);
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
      console.log(
         uploadStandingPostion.secure_url,
         uploadAimingPostion.secure_url,
         uploadLandingPostion.secure_url,
      );

      const newPost = new postData({
         UserID: user._id,
         postName: postName,
         mapName: mapName,
         lineupLocation: lineupLocation,
         lineupDescription: lineupDescription,
         teamSide: teamSide,
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
         jumpThrow: jumpThrow,
      });
      const savedPost = await newPost.save();
      res.json({
         message: 'Upload successful',
      });
   } catch (error) {
      res.send(error);
   }
});

export default router;
