import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mongo, cloudinary } from './config/index.js';
import { auth, user, post, comment, replies } from './routes/index.js';
import session from 'express-session';
import passport from 'passport';

dotenv.config();

mongo();
cloudinary();

const app = express();
app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => {
  res.send('server is running');
});

app.use(auth);
app.use(user);
app.use(post);
app.use(comment);
app.use(replies);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
