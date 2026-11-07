import mongoose from 'mongoose';

// JSON shape matches the frontend `Feature` type: { id, title, description, icon, created_at }
const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.__v;
      delete ret.order;
      return ret;
    }
  }
});

export default mongoose.model('Feature', featureSchema);
