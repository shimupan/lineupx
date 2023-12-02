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
   likes: {
      type: Number,
      required: true,
   },
   dislikes: {
      type: Number,
      required: true,
   },
   views: {
      type: Number,
      required: true,
   },
   standingPosition: {
      type: String,
      required: true,
   },
   aimingPosition: {
      type: String,
      required: true,
   },
   landingPosition: {
      type: String,
      required: true,
   },
   grenadeType: {
      type: String,
      required: true,
   },
   jumpThrow: {
      type: Boolean,
      required: true,
   },
});

const postData = mongoose.model('PostData', PostDataSchema);

export default postData;