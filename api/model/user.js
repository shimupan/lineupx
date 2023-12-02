import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

UserSchema.pre('save', async function (next) {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate({ _id: 'userId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
      this.id = counter.seq;
    }
  
    // Hash the password only if it's new or has been modified
    if (this.isModified('password')) {
      try {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
      } catch (error) {
        next(error);
      }
    }
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
