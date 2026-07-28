import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    pointsRequired: { type: Number, required: true, min: 1 },
    discountValue: { type: Number, required: true, min: 0 },
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    stock: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Gift = mongoose.model('Gift', giftSchema);

export default Gift;
