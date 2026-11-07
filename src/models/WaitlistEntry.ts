import mongoose from 'mongoose';

const waitlistEntrySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true }
}, { timestamps: true });

export default mongoose.model('WaitlistEntry', waitlistEntrySchema);
