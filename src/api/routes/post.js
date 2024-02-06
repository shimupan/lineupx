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
   const page = Number(req.query.page) || 1;
   const recent = req.query.recent || false;
   const map = req.query.map || null;
   const search = req.query.search || null;

   const PostData = mongoose.model('PostData', PostDataSchema, game);
   const pageSize = 20;
   if (recent) {
      PostData.find({ approved: true })
         .skip((page - 1) * pageSize)
         .limit(pageSize)
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   } else if (map) {
      const parsedMap = map.replace(/\s/g, '').toLowerCase();
      PostData.find({ mapName: parsedMap, approved: true })
         .skip((page - 1) * pageSize)
         .limit(pageSize)
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   } else if (search) {
      const reg = new RegExp(search.split(' ').join('.*'), 'i');
      PostData.find({
         $or: [
            { postTitle: { $regex: reg } },
            { mapName: { $regex: reg } },
         ],
         approved: true,
      })
         .skip((page - 1) * pageSize)
         .limit(pageSize)
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   } else {
      PostData.find({ approved: true })
         .skip((page - 1) * pageSize)
         .limit(pageSize)
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   }
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
      comments,
      lineupLocationCoords,
      lineupPositionCoords,
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
         comments: [],
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
         lineupLocationCoords: {
            x: lineupLocationCoords.x,
            y: lineupLocationCoords.y,
            name: lineupLocationCoords.name,
         },
         lineupPositionCoords: {
            x: lineupPositionCoords.x,
            y: lineupPositionCoords.y,
         },
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

// Endpoint to add a comment to a post
router.post('/post/:id/comment', async (req, res) => {
   const { id } = req.params;
   const { username, userId, text } = req.body;

   if (!text) {
      return res.status(400).send('Comment text is required');
   }

   try {
      const PostData = mongoose.model('PostData', PostDataSchema);
      const post = await PostData.findById(id);

      if (!post) {
         return res.status(404).send('Post not found');
      }

      const comment = {
         username: username,
         user: userId,
         text: text,
      };

      post.comments.push(comment);
      await post.save();

      res.status(200).send(post);
   } catch (error) {
      console.error('Failed to add comment:', error);
      res.status(500).send('Server error');
   }
});

// Increment like count for a specific post
router.post('/post/:id/increment-like', async (req, res) => {
   const { id } = req.params;
   const { userId } = req.body;

   const PostData = mongoose.model('PostData', PostDataSchema);

   try {
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }

      // Check if the user has already liked the post
      if (post.likes.some((like) => like.userId === userId)) {
         await PostData.updateOne(
            { _id: id },
            { $pull: { likes: { userId: userId } } },
         );
         return res.send(post);
      }

      // Check if the user has already disliked the post
      if (post.dislikes.some((dislike) => dislike.userId === userId)) {
         await PostData.updateOne(
            { _id: id },
            { $pull: { dislikes: { userId: userId } } },
         );
      }

      post.likes.push({ userId: userId });
      await post.save();

      res.send(post);
   } catch (error) {
      console.error('Failed to increment like count:', error);
      res.status(500).send('Server error');
   }
});

// Increment dislike count for a specific post
router.post('/post/:id/increment-dislike', async (req, res) => {
   const { id } = req.params;
   const { userId } = req.body;

   const PostData = mongoose.model('PostData', PostDataSchema);

   try {
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }

      // Check if the user has already disliked the post
      if (post.dislikes.some((dislike) => dislike.userId === userId)) {
         await PostData.updateOne(
            { _id: id },
            { $pull: { dislikes: { userId: userId } } },
         );
         return res.send(post);
      }

      // Check if the user has already liked the post
      if (post.likes.some((like) => like.userId === userId)) {
         await PostData.updateOne(
            { _id: id },
            { $pull: { likes: { userId: userId } } },
         );
      }

      post.dislikes.push({ userId: userId });
      await post.save();

      res.send(post);
   } catch (error) {
      console.error('Failed to increment dislike count:', error);
      res.status(500).send('Server error');
   }
});

/*
router.post('/save-coordinates', (req, res) => {
   const { x, y } = req.body;

   fs.readFile('ancient.json', 'utf8', (err, data) => {
      if (err) {
         console.error(err);
         res.status(500).send('An error occurred');
         return;
      }
      const name = '';
      const json = JSON.parse(data);
      json.coordinates.push({ x, y, name});

      fs.writeFile('ancient.json', JSON.stringify(json, null, 2), 'utf8', (err) => {
         if (err) {
            console.error(err);
            res.status(500).send('An error occurred');
            return;
         }

         res.send('Coordinates saved successfully');
      });
   });
});
*/

router.post('/resize-image', async (req, res) => {
   const { imageUrl } = req.body;

   // Check if imageUrl is provided
   if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
   }

   try {
      // Generate the transformed image URL
      const transformedImageUrl = cloudinaryObject.url(imageUrl, {
         type: 'fetch', // Add this line
         width: 2048,
         height: 2048,
         crop: 'fill',
      });

      res.status(200).send({ resizedImageUrl: transformedImageUrl });
   } catch (error) {
      console.error('Error resizing image:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});

// return all posts for a specific lineup location
router.get('/location/:map/:game/:LineupLocation/:agent?', async (req, res) => {
   const { game, LineupLocation, map, agent } = req.params;
   const parsedMap = map.replace(/\s/g, '').toLowerCase();
   if (game === 'CS2') {
      const PostData = mongoose.model('PostData', PostDataSchema, game);
      PostData.find({
         'lineupLocationCoords.name': LineupLocation,
         mapName: parsedMap,
         approved: true,
      })
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   } else if (game === 'Valorant') {
      const PostData = mongoose.model('PostData', PostDataSchema, game);
      PostData.find({
         'lineupLocationCoords.name': LineupLocation,
         valorantAgent: agent,
         mapName: map,
         approved: true,
      })
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   }
});

// returns all post for a specific grenade
router.get('/grenade/:map/:game/:grenade', async (req, res) => {
   const { game, map, grenade } = req.params;
   const parsedMap = map.replace(/\s/g, '').toLowerCase();
   if (game === 'CS2') {
      const PostData = mongoose.model('PostData', PostDataSchema, game);
      PostData.find({
         grenadeType: grenade.toLowerCase(),
         mapName: parsedMap,
         approved: true,
      })
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   } else if (game === 'Valorant') {
      const PostData = mongoose.model('PostData', PostDataSchema, game);
      PostData.find({
         ability: grenade,
         mapName: map,
         approved: true,
      })
         .then((data) => {
            res.send(data);
         })
         .catch((err) => {
            res.send(err);
         });
   }
});

// returns all post for a specific map

export default router;
