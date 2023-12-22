import mongoose from 'mongoose';

const PostDataSchema = new mongoose.Schema({
   UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
   },
   postTitle: {
      type: String,
      required: true,
   },
   mapName: {
      type: String,
      required: true,
   },
   lineupLocation: {
      type: String,
      required: false,
   },
   lineupDescription: {
      type: String,
      required: false,
   },
   teamSide: {
      type: String,
      required: false,
   },
   likes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PostData',
         required: false,
      },
   ],
   dislikes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PostData',
         required: false,
      },
   ],
   views: {
      type: Number,
      required: true,
   },
   standingPosition: {
      public_id: {
         type: String,
         required: true,
      },
      asset_id: {
         type: String,
         required: true,
      },
   },
   aimingPosition: {
      public_id: {
         type: String,
         required: true,
      },
      asset_id: {
         type: String,
         required: true,
      },
   },
   landingPosition: {
      public_id: {
         type: String,
         required: true,
      },
      asset_id: {
         type: String,
         required: true,
      },
   },
   grenadeType: {
      type: String,
      required: true,
   },
   jumpThrow: {
      type: Boolean,
      required: true,
   },
   game: {
      type: String,
      required: true,
   },
});

const postData = mongoose.model('PostData', PostDataSchema, 'PostData');

export default postData;
