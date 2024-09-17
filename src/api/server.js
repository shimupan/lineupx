import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mongo } from './config/index.js';
import {
   auth,
   user,
   post,
   comment,
   replies,
   health,
   leaderboard,
} from './routes/index.js';
import session from 'express-session';
import passport from 'passport';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import PostDataSchema from './model/postData.js';

dotenv.config();

mongo();

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
   res.send('server is running');
});

app.use(
   session({
      secret: 'mrpopo',
      resave: false,
      saveUninitialized: false,
   }),
);

app.use(auth);
app.use(user);
app.use(post);
app.use(comment);
app.use(replies);
app.use(health);
app.use(leaderboard);
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('incrementLike', async ({ postId, userId, game }) => {
    try {
      const PostData = mongoose.model('PostData', PostDataSchema, game);
      const post = await PostData.findById(postId);
      if (!post) {
        console.error('Post not found');
        return;
      }
      if (!post.likes.some(like => like.userId === userId)) {
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
      if (!post.dislikes.some(dislike => dislike.userId === userId)) {
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
      post.likes = post.likes.filter(like => like.userId !== userId);
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
      post.dislikes = post.dislikes.filter(dislike => dislike.userId !== userId);
      await post.save();
      io.emit('dislikeUpdate', { postId, dislikes: post.dislikes });
    } catch (error) {
      console.error('Error removing dislike:', error);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// await updateCS2Posts();
// await updateValorantPosts();