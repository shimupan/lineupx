import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
   UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
   },
   PostID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostData',
   },
   commentText: {
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
   timeStamp: {
      type: Date,
      required: true,
   },
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;