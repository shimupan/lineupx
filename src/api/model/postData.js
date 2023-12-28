import mongoose from 'mongoose';

const PostDataSchema = new mongoose.Schema({
   Username: {
      type: String,
      required: true,
   },
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
      required: function () {
         return this.game !== 'Valorant';
      },
   },
   jumpThrow: {
      type: Boolean,
      required: true,
   },
   game: {
      type: String,
      required: true,
   },
   approved: {
      type: Boolean,
      required: true,
   },
   valorantAgent: {
      type: String,
      required: function () {
         return this.game !== 'CS2';
      },
   },
   ability: {
      type: String,
      required: function () {
         return this.game !== 'CS2';
      },
   },
   lineupLocation: {
      type: String,
      required: true,
   },
   lineupDescription: {
      type: String,
      required: true,
   },
   teamSide: {
      type: String,
      required: true,
   },
   comments: [
      {
         username: {
            type: String,
            ref: 'User',
            required: true,
         },
         user: {
            type: String,
            ref: 'User',
            required: true,
         },
         text: {
            type: String,
            required: true,
         },
         createdAt: {
            type: Date,
            default: Date.now,
         },
      },
   ],
});

export default PostDataSchema;
