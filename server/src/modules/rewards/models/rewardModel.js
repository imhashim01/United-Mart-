import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true },
    type: { type: String, enum: ['earned', 'redeemed', 'expired', 'adjusted'], required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', default: null },
    description: { type: String, trim: true },
    balanceAfter: { type: Number, required: true, min: 0 },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

rewardSchema.index({ user: 1, createdAt: -1 });

export const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
