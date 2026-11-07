import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: { type: String, enum: ['coach', 'client'], default: 'client' }
}, { timestamps: true });

// ARCHITECTURE UPDATE: Removed the 'next' callback. 
// Mongoose natively handles Promises in async hooks.
userSchema.pre('save', async function () {
  // If the password hasn't been modified, skip hashing
  if (!this.isModified('password')) {
    return; // Simply return to exit the function
  }

  // Mongoose automatically wraps this in a try/catch behind the scenes
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;