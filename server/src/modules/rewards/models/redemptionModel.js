import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', required: true },
    pointsUsed: { type: Number, required: true },
    discountValue: { type: Number, required: true },
    status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' },
    redeemedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Redemption = mongoose.model('Redemption', redemptionSchema);

export default Redemption;
