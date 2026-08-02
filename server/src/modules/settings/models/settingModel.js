import mongoose from 'mongoose';

// Singleton — exactly one document ever exists for the whole store.
const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'United Mart Sukkur' },
    supportEmail: { type: String, default: 'support@unitedmartsukkur.pk' },
    supportPhone: { type: String, default: '+92 300 1234567' },
    address: { type: String, default: 'Station Road, Sukkur, Sindh, Pakistan' },
    deliveryFlatRate: { type: Number, default: 200, min: 0 },
    freeDeliveryThreshold: { type: Number, default: 5000, min: 0 },
    minimumOrderAmount: { type: Number, default: 1000, min: 0 },
    orderCutoffTime: { type: String, default: '16:00' },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;