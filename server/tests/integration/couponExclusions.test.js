import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../../app.js';
import Category from '../../src/modules/categories/models/categoryModel.js';
import Product from '../../src/modules/products/models/productModel.js';
import Coupon from '../../src/modules/coupons/models/couponModel.js';
import { createOrderFromCart } from '../../src/modules/orders/services/orderService.js';

describe('Coupon category exclusions', () => {
  let mongod;
  let app;
  let oil;
  let rice;
  let oilProduct; // Rs 1000 each
  let riceProduct; // Rs 1000 each
  let multiCategoryOil; // primary category Oil, additional category Rice — Rs 1000 each

  const cart = (oilQty, riceQty) => [
    ...(oilQty ? [{ productId: oilProduct.id, quantity: oilQty }] : []),
    ...(riceQty ? [{ productId: riceProduct.id, quantity: riceQty }] : []),
  ];

  const validate = (code, items) => request(app).post('/api/v1/coupons/validate').send({ code, items });

  const placeGuestOrder = (couponCode, items) =>
    createOrderFromCart({
      guestName: 'Test Guest',
      shippingAddress: { line1: 'Street 1', city: 'Sukkur', phone: '03000000000' },
      paymentMethod: 'cod',
      couponCode,
      items,
    });

  beforeAll(async () => {
    // Placing test orders must never send Purchase events to the real Meta pixel.
    delete process.env.META_CAPI_ACCESS_TOKEN;
    // TEST_DB_PATH lets the in-memory server's files live on a drive with free space.
    mongod = await MongoMemoryServer.create(
      process.env.TEST_DB_PATH ? { instance: { dbPath: process.env.TEST_DB_PATH } } : {}
    );
    await mongoose.connect(mongod.getUri());
    app = createApp();

    [oil, rice] = await Category.create([{ name: 'Oil' }, { name: 'Rice' }]);
    const base = { description: 'test', price: 1000, stock: 1000 };
    [oilProduct, riceProduct, multiCategoryOil] = await Product.create([
      { ...base, name: 'Cooking Oil', sku: 'OIL-1', category: oil._id },
      { ...base, name: 'Basmati Rice', sku: 'RICE-1', category: rice._id },
      { ...base, name: 'Oil Combo', sku: 'OIL-2', category: oil._id, additionalCategories: [rice._id] },
    ]);

    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Coupon.create([
      {
        code: 'NOOIL200', discountType: 'fixed', discountValue: 200, minPurchaseAmount: 5000,
        usageLimitPerUser: 100, validUntil, excludedCategories: [oil._id],
      },
      {
        code: 'NOOIL10', discountType: 'percentage', discountValue: 10, minPurchaseAmount: 0,
        usageLimitPerUser: 100, validUntil, excludedCategories: [oil._id],
      },
      { code: 'PLAIN10', discountType: 'percentage', discountValue: 10, minPurchaseAmount: 5000, usageLimitPerUser: 100, validUntil },
    ]);
  }, 120000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod?.stop();
  });

  // (a)
  it('rejects a cart whose non-oil items are under the minimum even though the total is over it', async () => {
    const items = cart(3, 3); // Rs 6000 total, Rs 3000 eligible
    const res = await validate('NOOIL200', items);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Add Rs 2,000 more of eligible items. Some categories, like Oil, don't count toward this coupon."
    );

    const order = await placeGuestOrder('NOOIL200', items);
    expect(order.subtotal).toBe(6000);
    expect(order.discountAmount).toBe(0);
    expect(order.coupon).toBeNull();
  });

  // (b)
  it('accepts a cart with Rs 5000+ of non-oil items', async () => {
    const items = cart(2, 5); // Rs 7000 total, Rs 5000 eligible
    const res = await validate('NOOIL200', items);
    expect(res.status).toBe(200);
    expect(res.body.data.discount).toBe(200);
    expect(res.body.data.eligibleSubtotal).toBe(5000);

    const order = await placeGuestOrder('NOOIL200', items);
    expect(order.discountAmount).toBe(200);
    expect(order.totalAmount).toBe(6800); // 7000 - 200, free delivery above the default threshold
  });

  it('calculates a percentage discount from eligible items only', async () => {
    const res = await validate('NOOIL10', cart(4, 2)); // eligible Rs 2000
    expect(res.status).toBe(200);
    expect(res.body.data.discount).toBe(200);
  });

  it('excludes a product whose primary category is excluded, even if an additional category is not', async () => {
    const res = await validate('NOOIL200', [
      { productId: multiCategoryOil.id, quantity: 3 },
      { productId: riceProduct.id, quantity: 3 },
    ]);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Add Rs 2,000 more of eligible items/);
  });

  it('rejects a cart made up only of excluded items', async () => {
    const res = await validate('NOOIL10', cart(3, 0));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/None of the items in your cart are eligible/);
  });

  // (c)
  it('leaves coupons without exclusions working exactly as before', async () => {
    const items = cart(3, 3); // Rs 6000, all of it counts
    const res = await validate('PLAIN10', items);
    expect(res.status).toBe(200);
    expect(res.body.data.discount).toBe(600);

    const order = await placeGuestOrder('PLAIN10', items);
    expect(order.discountAmount).toBe(600);

    const tooSmall = await validate('PLAIN10', cart(2, 2));
    expect(tooSmall.status).toBe(400);
    expect(tooSmall.body.message).toBe('Minimum purchase of Rs.5000 required for this coupon');
  });

  it('requires cart items rather than a client-supplied subtotal', async () => {
    const res = await request(app).post('/api/v1/coupons/validate').send({ code: 'PLAIN10', subtotal: 999999 });
    expect(res.status).toBe(400);
  });
});
