import { Server } from 'socket.io';
import mongoose from 'mongoose';
import PostDataSchema from '../model/postData.js';

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
   });

   return io;
};

export const getIo = () => io;
export default setupSocket;
