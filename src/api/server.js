import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mongo } from './config/index.js';
import { auth, user, post, comment, replies } from './routes/index.js';
import session from 'express-session';
import passport from 'passport';
/*
import mongoose from 'mongoose';
import PostDataSchema from './model/PostData.js';
*/

dotenv.config();

mongo();

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

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
app.use(passport.initialize());
app.use(passport.session());

/* DELETE LATER 
const ValorantPostData = mongoose.model('ValorantPostData', PostDataSchema, 'Valorant');
const CS2PostData = mongoose.model('CS2PostData', PostDataSchema, 'CS2');


const newField = {
  reports: [],
};

// Function to update documents in a collection
const updateCollection = (model) => {
   model.updateMany({}, { $set: newField })
     .then((result) => {
       console.log(`Updated ${result.nModified} documents in ${model.collection.collectionName}`);
     })
     .catch((error) => {
       console.error(`Error updating documents in ${model.collection.collectionName}:`, error);
     });
 };
 
 // Update documents in the Valorant and CS2 collections
 updateCollection(ValorantPostData);
 updateCollection(CS2PostData);
*/
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
