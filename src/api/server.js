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
import http from 'http';
import setupSocket, { getIo } from './sockets/socket.js';

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

const server = http.createServer(app);

setupSocket(server);

// Middleware to attach io to the request object
app.use((req, res, next) => {
   req.io = getIo(); // Attach the io instance to the request object
   next(); // Call next to pass control to the next middleware
});

// Define your routes after the middleware
app.use(auth);
app.use(user);
app.use(post); 
app.use(comment);
app.use(replies);
app.use(health);
app.use(leaderboard);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 1337;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));