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
   CommentText: {
      type: String,
      required: true,
   },
   Replies: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Comment'
   },
   Likes: {
      type: Number,
      required: true,
   },
   Dislikes: {
      type: Number,
      required: true,
   },
   Views: {
      type: Number,
      required: true,
   },
   TimeStamp: {
      type: Date,
      required: true,
   },
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;