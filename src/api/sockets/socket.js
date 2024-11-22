import { Server } from 'socket.io';
import mongoose from 'mongoose';
import PostDataSchema from '../model/postData.js';
import { createNotification } from '../routes/notifications.js';

let io;

const setupSocket = (server) => {
   io = new Server(server, {
      cors: {
         origin: '*',
         methods: ['GET', 'POST'],
      },
   });

   io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
         console.log('User disconnected');
      });

      socket.on('joinNotificationRoom', (userId) => {
         if (userId) {
            socket.join(`notification_${userId}`);
            console.log(`User ${userId} joined their notification room`);
         }
      });

      socket.on('incrementViewCount', async ({ postId, game }) => {
         try {
            const PostData = mongoose.model('PostData', PostDataSchema, game);
            const post = await PostData.findById(postId);
            if (!post) {
               console.error('Post not found');
               return;
            }

            post.views += 1;
            await post.save();

            io.emit('viewUpdate', { postId, views: post.views });
         } catch (error) {
            console.error('Error incrementing view count:', error);
         }
      });

      socket.on('incrementLike', async ({ postId, userId, game }) => {
         try {
            const PostData = mongoose.model('PostData', PostDataSchema, game);
            const post = await PostData.findById(postId);
            if (!post) {
               console.error('Post not found');
               return;
            }
            if (!post.likes.some((like) => like.userId === userId)) {
               post.likes.push({ userId });
               await post.save();
            }
            io.emit('likeUpdate', { postId, likes: post.likes });
         } catch (error) {
            console.error('Error incrementing like:', error);
         }
      });

      socket.on('incrementDislike', async ({ postId, userId, game }) => {
         try {
            const PostData = mongoose.model('PostData', PostDataSchema, game);
            const post = await PostData.findById(postId);
            if (!post) {
               console.error('Post not found');
               return;
            }
            if (!post.dislikes.some((dislike) => dislike.userId === userId)) {
               post.dislikes.push({ userId });
               await post.save();
            }
            io.emit('dislikeUpdate', { postId, dislikes: post.dislikes });
         } catch (error) {
            console.error('Error incrementing dislike:', error);
         }
      });

      socket.on('removeLike', async ({ postId, userId, game }) => {
         try {
            const PostData = mongoose.model('PostData', PostDataSchema, game);
            const post = await PostData.findById(postId);
            if (!post) {
               console.error('Post not found');
               return;
            }
            post.likes = post.likes.filter((like) => like.userId !== userId);
            await post.save();
            io.emit('likeUpdate', { postId, likes: post.likes });
         } catch (error) {
            console.error('Error removing like:', error);
         }
      });

      socket.on('removeDislike', async ({ postId, userId, game }) => {
         try {
            const PostData = mongoose.model('PostData', PostDataSchema, game);
            const post = await PostData.findById(postId);
            if (!post) {
               console.error('Post not found');
               return;
            }
            post.dislikes = post.dislikes.filter(
               (dislike) => dislike.userId !== userId,
            );
            await post.save();
            io.emit('dislikeUpdate', { postId, dislikes: post.dislikes });
         } catch (error) {
            console.error('Error removing dislike:', error);
         }
      });

      socket.on(
         'addComment',
         async ({ postId, userId, username, text, game }) => {
            try {
               const PostData = mongoose.model(
                  'PostData',
                  PostDataSchema,
                  game,
               );
               const post = await PostData.findById(postId);
               if (!post) {
                  console.error('Post not found');
                  return;
               }

               const comment = {
                  username,
                  user: userId,
                  text,
                  createdAt: new Date(),
               };

               post.comments.push(comment);
               await post.save();

               // Emit comment update to all clients
               io.emit('commentUpdate', {
                  postId,
                  comments: post.comments,
               });

               // Create notification for post owner
               if (post.UserID.toString() !== userId) {
                  const notification = await createNotification({
                     recipientId: post.UserID,
                     senderId: userId,
                     type: 'comment',
                     postId: post._id,
                     message: `commented on your post "${post.postTitle}"`,
                     game: game, 
                  });

                  if (notification) {
                     io.to(`notification_${post.UserID}`).emit(
                        'newNotification',
                        notification,
                     );
                  }
               }
            } catch (error) {
               console.error('Error adding comment:', error);
            }
         },
      );

      // Follow with notification
      socket.on('follow', async ({ followerId, followedId, username }) => {
         try {
            // Create notification for followed user
            const notification = await createNotification({
               recipientId: followedId,
               senderId: followerId,
               type: 'follow',
               message: `${username} started following you`
            });

            if (notification) {
               // Emit to specific user's notification room
               io.to(`notification_${followedId}`).emit('newNotification', notification);
            }

            // Emit follow update for real-time UI updates
            io.emit('followingUpdate', {
               userId: followerId,
               followedUserId: followedId,
               isFollowing: true,
               updatedUser: notification?.sender
            });
         } catch (error) {
            console.error('Error creating follow notification:', error);
         }
      });
   });

   return io;
};

export const getIo = () => io;
export default setupSocket;
