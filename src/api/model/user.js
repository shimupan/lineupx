import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
   },
   password: {
      type: String,
      required: true,
   },
   Verified: {
      type: Boolean,
      default: false,
   },
   verificationCode: {
      type: String,
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
   saved: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PostData',
         required: false,
      },
   ],
   resetPasswordToken: {
      type: String,
   },
   resetPasswordExpires: {
      type: Date,
   },
});

UserSchema.pre('save', async function (next) {
   // Hash password only if it has been modified (or is new)
   if (!this.isModified('password')) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
   } catch (error) {
      next(error);
   }
});

UserSchema.methods.passwordCheck = async function (password) {
   try {
      return await bcrypt.compare(password, this.password);
   } catch (error) {
      throw error;
   }
};

const User = mongoose.model('User', UserSchema, 'Users');

export default User;
