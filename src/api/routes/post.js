import express from 'express';
import mongoose from 'mongoose';
import PostDataSchema from '../model/postData.js';
import gameModels from '../model/postGameIndexing.js';
import cloudinary from '../config/cloudinary.js';
import rateLimit from 'express-rate-limit';

// Function to delete Cloudinary images
async function deleteCloudinaryImage(public_id) {
   try {
      await cloudinaryObject.uploader.destroy(public_id);
      console.log(`Deleted image with public_id: ${public_id}`);
   } catch (error) {
      console.error(`Error deleting image with public_id ${public_id}:`, error);
   }
}
const postLimit = rateLimit({
   windowMs: 24 * 60 * 60 * 1000,
   max: 10,
   message: 'Too many uploads, try again in 1 Day',
});

const router = express.Router();
const cloudinaryObject = cloudinary();
let projection = {};

// Find all post for a specific user
router.get('/post/:game/:id', (req, res) => {
   const { game, id } = req.params;

   const PostData = gameModels[game];
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

// Find all unapproved posts for a specific user
router.get('/post/unapproved/:game/:id', (req, res) => {
   const { game, id } = req.params;

   const PostData = gameModels[game];
   PostData.find({
      UserID: new mongoose.Types.ObjectId(id),
      approved: false,
   })
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         res.send(err);
      });
});

router.get('/post/detail/:game/:id', async (req, res) => {
   const { game, id } = req.params;
   const PostData = gameModels[game];

   try {
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }
      res.send(post);
   } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).send({ error: 'Internal Server Error' });
   }
});

//Find all posts given an array of postIds
router.get('/posts', async (req, res) => {
   const { game, postIds } = req.query;

   let postIdsArray = postIds.split(',');

   postIdsArray = [...new Set(postIdsArray)];
   console.log(postIdsArray);

   try {
      const PostData = gameModels[game];
      const posts = await PostData.find({ _id: { $in: postIdsArray } });
      res.status(200).json(posts);
   } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});

// Find all posts for a specific game with enhanced filtering and text scores
router.get('/post/:game', async (req, res) => {
   const { game } = req.params;
   const page = Number(req.query.page) || 1;
   const pageSize = Number(req.query.limit) || 20;
   const recent = req.query.recent;
   const map = req.query.map;
   const search = req.query.search;
   const filter = req.query.filter;
   const grenade = req.query.grenade;
   const location = req.query.location;
   const postname = req.query.postname;
   const PostData = gameModels[game];

   let query = {};
   let sortOption = { views: -1, date: -1 };
   let projection = {};

   // Array to hold all conditions
   let conditions = [{ approved: true }];

   try {
      // Map filtering
      if (map && map !== 'all') {
         const parsedMap = map.replace(/\s/g, '').toLowerCase();
         conditions.push({ mapName: { $regex: parsedMap, $options: 'i' } });
      }

      // Grenade filtering
      if (grenade && grenade !== 'all') {
         conditions.push({ grenadeType: { $regex: grenade, $options: 'i' } });
      }

      // Location filtering
      if (location && location !== 'all') {
         conditions.push({
            'lineupLocationCoords.name': { $regex: location, $options: 'i' },
         });
      }

      // Postname filtering
      if (postname && postname !== 'all') {
         conditions.push({ postTitle: { $regex: postname, $options: 'i' } });
      }

      // Date range filtering
      if (
         filter &&
         filter !== 'all' &&
         ['today', 'this_week', 'this_month', 'this_year'].includes(filter)
      ) {
         const dateFilter = getDateRangeFilter(filter);
         if (dateFilter) {
            conditions.push({ date: dateFilter });
         }
      }

      // Search filtering using $text
      if (search && search !== 'all') {
         conditions.push({ $text: { $search: search } });
         projection = { score: { $meta: 'textScore' } };
         sortOption = { score: { $meta: 'textScore' } };
      }

      // Recent sorting if no text search
      if (recent && recent !== 'all' && recent === 'true' && !search) {
         sortOption = { date: -1 };
      }

      // Additional sorting based on sortBy parameter
      if (req.query.sortBy && req.query.sortBy !== 'all') {
         const additionalSort = getSortOption(req.query.sortBy);
         sortOption = { ...sortOption, ...additionalSort };
      }

      // Combine all conditions with $and
      if (conditions.length > 0) {
         query = { $and: conditions };
      } else {
         query = { approved: true };
      }

      // Fetch the data with filters, projection, sorting, and pagination
      const data = await PostData.find(query, projection)
         .sort(sortOption)
         .skip((page - 1) * pageSize)
         .limit(pageSize)
         .exec();

      res.status(200).send(data);
   } catch (err) {
      console.error('Error in /post/:game route:', err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});

// Helper function for date range filtering
function getDateRangeFilter(range) {
   const now = new Date();
   let startDate, endDate;

   switch (range) {
      case 'today':
         startDate = new Date(now.setHours(0, 0, 0, 0));
         endDate = new Date(now.setHours(23, 59, 59, 999));
         break;
      case 'this_week':
         const firstDayOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay()),
         );
         startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
         endDate = new Date();
         break;
      case 'this_month':
         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
         endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
         );
         break;
      case 'this_year':
         startDate = new Date(now.getFullYear(), 0, 1);
         endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
         break;
      default:
         return null;
   }
   return { $gte: startDate, $lte: endDate };
}

// Helper function for sorting options
function getSortOption(sortBy) {
   const sortOptions = {
      view_count: { views: -1 },
      upload_date: { date: -1 },
   };
   return sortOptions[sortBy] || {};
}
router.post('/post/check', async (req, res) => {
   const { role } = req.body;
   if (role != 'admin') {
      return res.status(401).send('Unauthorized');
   }
   const CS2Data = gameModels['CS2'];
   const VALData = gameModels['VAL'];
   const CS2Posts = await CS2Data.find({ approved: false });
   const VALPosts = await VALData.find({ approved: false });
   res.status(200).send([CS2Posts, VALPosts]);
});

router.post('/post/:status', async (req, res) => {
   const { id, status, game, role } = req.body;

   if (role != 'admin') {
      return res.status(401).send('Unauthorized');
   }
   const PostData = gameModels[game];
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
   const JumpThrow = jumpThrow == 'Yes' ? true : false;

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
   const { id } = req.params;
   const { game } = req.body;

   try {
      const PostData = gameModels[game];
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

//endpoint to report a post
router.post('/post/:id/report', async (req, res) => {
   const { id } = req.params;
   const { userId, reason } = req.body;
   if (!reason) {
      return res.status(400).send('Reason is required');
   }

   try {
      const PostData = gameModels[game];
      const post = await PostData.findById(id);

      if (!post) {
         return res.status(404).send('Post not found');
      }

      const report = {
         userId: userId,
         reason: reason,
         createdAt: new Date(),
      };

      post.reports.push(report);
      await post.save();

      res.status(200).send('Report submitted successfully');
   } catch (error) {
      console.error('Error reporting post:', error);
      res.status(500).send({ error: 'Server Error' });
   }
});

// Endpoint to add a comment to a post
router.post('/post/:id/comment', async (req, res) => {
   const { id } = req.params;
   const { username, userId, text, game } = req.body;

   if (!text) {
      return res.status(400).send('Comment text is required');
   }

   try {
      const PostData = gameModels[game];
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

//Endpoint to delete a specific comment
router.delete('/post/:id/comment/:commentId', async (req, res) => {
   const { id, commentId } = req.params;
   const { userId, role } = req.body;

   try {
      const PostData = gameModels[game];
      const post = await PostData.findById(id);

      if (!post) {
         return res.status(404).send('Post not found');
      }

      const commentIndex = post.comments.findIndex(
         (comment) => comment._id.toString() === commentId,
      );

      if (commentIndex === -1) {
         return res.status(404).send('Comment not found');
      }

      if (post.comments[commentIndex].user !== userId && role !== 'admin') {
         return res.status(403).send('Unauthorized to delete this comment');
      }

      post.comments.splice(commentIndex, 1);

      await post.save();

      res.status(200).send('Comment deleted successfully');
   } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).send('Internal Server Error');
   }
});

router.put('/post/:id', async (req, res) => {
   const { id } = req.params;
   const {
      userId,
      postTitle,
      lineupDescription,
      role,
      game,
      jumpThrow,
      teamSide,
      standingPosition,
      aimingPosition,
      landingPosition,
   } = req.body;

   try {
      const PostData = gameModels[game];
      const post = await PostData.findById(id);

      if (!post) {
         return res.status(404).send('Post not found');
      }

      if (post.UserID.toString() !== userId.toString() && role !== 'admin') {
         return res
            .status(403)
            .json({ message: 'User not authorized to edit this post' });
      }

      // Delete old images if new ones are provided
      if (standingPosition && post.standingPosition) {
         await deleteCloudinaryImage(post.standingPosition.public_id);
      }
      if (aimingPosition && post.aimingPosition) {
         await deleteCloudinaryImage(post.aimingPosition.public_id);
      }
      if (landingPosition && post.landingPosition) {
         await deleteCloudinaryImage(post.landingPosition.public_id);
      }

      // Prepare updated fields
      if (postTitle) post.postTitle = postTitle;
      if (lineupDescription) post.lineupDescription = lineupDescription;
      if (jumpThrow) post.jumpThrow = jumpThrow;
      if (teamSide) post.teamSide = teamSide;

      // Update cloudinary images if provided
      if (standingPosition) {
         const uploadStandingPosition = await cloudinaryObject.uploader.upload(
            standingPosition,
            { folder: game },
         );
         post.standingPosition = {
            public_id: uploadStandingPosition.public_id,
            asset_id: uploadStandingPosition.asset_id,
         };
      }
      if (aimingPosition) {
         const uploadAimingPosition = await cloudinaryObject.uploader.upload(
            aimingPosition,
            { folder: game },
         );
         post.aimingPosition = {
            public_id: uploadAimingPosition.public_id,
            asset_id: uploadAimingPosition.asset_id,
         };
      }
      if (landingPosition) {
         const uploadLandingPosition = await cloudinaryObject.uploader.upload(
            landingPosition,
            { folder: game },
         );
         post.landingPosition = {
            public_id: uploadLandingPosition.public_id,
            asset_id: uploadLandingPosition.asset_id,
         };
      }

      const updatedPost = await post.save();

      res.status(200).json(updatedPost);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
});

router.put('/post/:id/comment/:commentId', async (req, res) => {
   const { id, commentId } = req.params;
   const { userId, role, text } = req.body;

   if (!text) {
      return res.status(400).send('Comment text is required');
   }

   try {
      const PostData = gameModels[game];
      const post = await PostData.findById(id);

      if (!post) {
         return res.status(404).send('Post not found');
      }

      const commentIndex = post.comments.findIndex(
         (comment) => comment._id.toString() === commentId,
      );

      if (commentIndex === -1) {
         return res.status(404).send('Comment not found');
      }

      if (post.comments[commentIndex].user !== userId && role !== 'admin') {
         return res.status(403).send('Unauthorized to edit this comment');
      }

      post.comments[commentIndex].text = text;
      await post.save();

      res.status(200).send('Comment edited successfully');
   } catch (error) {
      console.error('Error editing comment:', error);
      res.status(500).send('Internal Server Error');
   }
});

// Increment like count for a specific post
router.post('/post/:id/increment-like', async (req, res) => {
   const { id } = req.params;
   const { userId, game } = req.body;

   try {
      const PostData = gameModels[game];
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
   const { userId, game } = req.body;

   try {
      const PostData = gameModels[game];
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

router.post('/post/:id/remove-like', async (req, res) => {
   const { id } = req.params;
   const { userId, game } = req.body;

   try {
      const PostData = gameModels[game];
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }

      // Remove like if it exists
      if (post.likes.some((like) => like.userId === userId)) {
         await PostData.updateOne(
            { _id: id },
            { $pull: { likes: { userId: userId } } },
         );
         return res.send(post);
      }

      res.status(400).send('Like not found');
   } catch (error) {
      console.error('Failed to remove like:', error);
      res.status(500).send('Server error');
   }
});

// Remove dislike for a specific post
router.post('/post/:id/remove-dislike', async (req, res) => {
   const { id } = req.params;
   const { userId, game } = req.body;

   try {
      const PostData = gameModels[game];
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }

      // Remove dislike if it exists
      if (post.dislikes.some((dislike) => dislike.userId === userId)) {
         await PostData.updateOne(
            { _id: id },
            { $pull: { dislikes: { userId: userId } } },
         );
         return res.send(post);
      }

      res.status(400).send('Dislike not found');
   } catch (error) {
      console.error('Failed to remove dislike:', error);
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
      const PostData = gameModels[game];
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
      const PostData = gameModels[game];
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
   const { game, map } = req.params;
   let { grenade } = req.params;
   grenade = decodeURIComponent(grenade);
   const parsedMap = map.replace(/\s/g, '').toLowerCase();
   if (game === 'CS2') {
      const PostData = gameModels[game];
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
      const PostData = gameModels[game];
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

// Delete a post
router.delete('/post/:game/:id', async (req, res) => {
   const { game, id } = req.params;
   const { role } = req.body; // Assuming you're passing the user's role in the request body

   if (role !== 'admin') {
      return res.status(401).send('Unauthorized');
   }

   const PostData = gameModels[game];

   try {
      const post = await PostData.findById(id);
      if (!post) {
         return res.status(404).send('Post not found');
      }

      // Delete images from Cloudinary
      await deleteCloudinaryImage(post.aimingPosition.public_id);
      await deleteCloudinaryImage(post.standingPosition.public_id);
      await deleteCloudinaryImage(post.landingPosition.public_id);

      // Delete the post from the database
      await PostData.findByIdAndDelete(id);

      res.status(200).send({ message: 'Post deleted successfully' });
   } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send({ error: 'Internal Server Error' });
   }
});

export default router;
