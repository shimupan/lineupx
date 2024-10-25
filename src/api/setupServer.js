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

dotenv.config();

mongo();

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
   res.status(200).json({ data: 'server is running' });
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

export default app;