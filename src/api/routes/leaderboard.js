import express from 'express';
import mongoose from 'mongoose';
import PostDataSchema from '../model/postData.js';
import User from '../model/user.js';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
   try {
      const gameNames = ['CS2', 'Valorant'];

      let userPostCounts = {};

      for (const gameName of gameNames) {
         const PostData = mongoose.model('PostData', PostDataSchema, gameName);

         const now = new Date();
         const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
         );
         const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
         const today = new Date(now.setHours(0, 0, 0, 0));

         const postCounts = await PostData.aggregate([
            { $match: { approved: true } },
            {
               $group: {
                  _id: '$UserID',
                  totalPosts: { $sum: 1 },
                  monthlyPosts: {
                     $sum: {
                        $cond: [{ $gte: ['$createdAt', oneMonthAgo] }, 1, 0],
                     },
                  },
                  weeklyPosts: {
                     $sum: {
                        $cond: [{ $gte: ['$createdAt', oneWeekAgo] }, 1, 0],
                     },
                  },
                  dailyPosts: {
                     $sum: { $cond: [{ $gte: ['$createdAt', today] }, 1, 0] },
                  },
               },
            },
         ]);

         postCounts.forEach((count) => {
            const userId = count._id.toString();
            if (!userPostCounts[userId]) {
               userPostCounts[userId] = {
                  totalPosts: 0,
                  monthlyPosts: 0,
                  weeklyPosts: 0,
                  dailyPosts: 0,
               };
            }
            userPostCounts[userId].totalPosts += count.totalPosts;
            userPostCounts[userId].monthlyPosts += count.monthlyPosts;
            userPostCounts[userId].weeklyPosts += count.weeklyPosts;
            userPostCounts[userId].dailyPosts += count.dailyPosts;
         });
      }

      const users = await User.find({}, 'username ProfilePicture');

      const leaderboardData = users.map((user) => ({
         _id: user._id,
         username: user.username,
         ProfilePicture: user.ProfilePicture,
         ...(userPostCounts[user._id.toString()] || {
            totalPosts: 0,
            monthlyPosts: 0,
            weeklyPosts: 0,
            dailyPosts: 0,
         }),
      }));

      res.json(leaderboardData);
   } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      res.status(500).json({ message: 'Server error' });
   }
});

router.get('/leaderboard/position/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const gameNames = ['CS2', 'Valorant'];

      let userPostCounts = {};

      for (const gameName of gameNames) {
         const PostData = mongoose.model('PostData', PostDataSchema, gameName);

         const postCounts = await PostData.aggregate([
            { $match: { approved: true } },
            {
               $group: {
                  _id: '$UserID',
                  totalPosts: { $sum: 1 },
               },
            },
         ]);

         postCounts.forEach((count) => {
            const id = count._id.toString();
            userPostCounts[id] = (userPostCounts[id] || 0) + count.totalPosts;
         });
      }

      const sortedUsers = Object.entries(userPostCounts)
         .sort(([, a], [, b]) => b - a)
         .map(([id, posts]) => ({ id, posts }));

      const userPosition =
         sortedUsers.findIndex((user) => user.id === userId) + 1;

      if (userPosition === 0) {
         return res
            .status(404)
            .json({ message: 'User not found on leaderboard' });
      }

      const user = await User.findById(userId, 'username ProfilePicture');

      res.json({
         position: userPosition,
         username: user.username,
         ProfilePicture: user.ProfilePicture,
         totalPosts: userPostCounts[userId] || 0,
      });
   } catch (error) {
      console.error('Error fetching user leaderboard position:', error);
      res.status(500).json({ message: 'Server error' });
   }
});

export default router;
