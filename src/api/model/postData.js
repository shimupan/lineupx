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
   teamSide: {
      type: String,
      required: false,
   },
   likes: [
      {
         userId: {
            type: String,
            ref: 'User',
            required: false,
         },
      },
   ],
   dislikes: [
      {
         userId: {
            type: String,
            ref: 'User',
            required: false,
         },
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
   date: {
      type: Date,
      default: Date.now,
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
   lineupLocationCoords: {
      x: {
         type: Number,
         required: true,
      },
      y: {
         type: Number,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
   },
   lineupPositionCoords: {
      x: {
         type: Number,
         required: true,
      },
      y: {
         type: Number,
         required: true,
      },
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
   reports: [
      {
         userId: {
            type: String,
            ref: 'User',
            required: true,
         },
         reason: {
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
PostDataSchema.index({
  postTitle: 'text',
  mapName: 'text',
  lineupLocation: 'text',
  valorantAgent: 'text',
  ability: 'text',
  grenadeType: 'text',
});

export default PostDataSchema;
