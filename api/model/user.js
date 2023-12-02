import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email format validation
  },
  password: { 
    type: String, 
    required: true 
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostData',
    required: false,
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostData',
    required: false,
  }],
  saved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostData',
    required: false,
  }],
});

const User = mongoose.model('User', UserSchema);

export default User;
