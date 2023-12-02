import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
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

UserSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.passwordCheck = async function(password) { 
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', UserSchema, "Users");

export default User;
