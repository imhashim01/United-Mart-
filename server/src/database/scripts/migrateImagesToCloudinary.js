// One-time migration: finds every product image (and variant image) that
// isn't already hosted on Cloudinary, and re-uploads it to Cloudinary
// directly from its existing URL — Cloudinary fetches the remote file
// itself, so this doesn't require downloading anything locally first.
// Run with: npm run migrate:images (from the server folder)

import dotenv from 'dotenv';
import cloudinary from '../../config/cloudinary.js';
import { connectDB } from '../../config/db.js';
import Product from '../../modules/products/models/productModel.js';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isAlreadyCloudinary = (url) => typeof url === 'string' && url.includes('res.cloudinary.com');

const migrateImage = async (image, context) => {
  if (!image?.url || isAlreadyCloudinary(image.url)) {
    return { image, migrated: false };
  }

  try {
    const result = await cloudinary.uploader.upload(image.url, {
      folder: 'united-mart-sukkur/products',
      resource_type: 'image',
    });
    console.log(`  ✓ Migrated (${context}): ${image.url.slice(0, 60)}... -> ${result.secure_url}`);
    return {
      image: {
        ...(image.toObject ? image.toObject() : image),
        url: result.secure_url,
        publicId: result.public_id,
      },
      migrated: true,
    };
  } catch (error) {
    console.error(`  ✗ FAILED (${context}): ${image.url.slice(0, 80)} — ${error.message}`);
    return { image, migrated: false, failed: true };
  }
};

const run = async () => {
  await connectDB();

  const products = await Product.find({});
  console.log(`Found ${products.length} products to check.\n`);

  let totalMigrated = 0;
  let totalFailed = 0;
  const failedUrls = [];

  for (const product of products) {
    let changed = false;
    console.log(`Checking: ${product.name}`);

    for (let i = 0; i < product.images.length; i++) {
      const { image, migrated, failed } = await migrateImage(product.images[i], `${product.name} — image ${i + 1}`);
      if (migrated) {
        product.images[i] = image;
        changed = true;
        totalMigrated++;
      }
      if (failed) {
        totalFailed++;
        failedUrls.push({ product: product.name, url: product.images[i].url });
      }
      await sleep(250);
    }

    for (const variant of product.variants) {
      for (let i = 0; i < variant.images.length; i++) {
        const { image, migrated, failed } = await migrateImage(variant.images[i], `${product.name} / ${variant.name || variant.sku} — image ${i + 1}`);
        if (migrated) {
          variant.images[i] = image;
          changed = true;
          totalMigrated++;
        }
        if (failed) {
          totalFailed++;
          failedUrls.push({ product: `${product.name} (variant: ${variant.name || variant.sku})`, url: variant.images[i].url });
        }
        await sleep(250);
      }
    }

    if (changed) {
      await product.save();
      console.log(`  → Saved updated image URLs for "${product.name}"\n`);
    }
  }

  console.log('\n========== Migration complete ==========');
  console.log(`Successfully migrated: ${totalMigrated} images`);
  console.log(`Failed: ${totalFailed} images`);
  if (failedUrls.length > 0) {
    console.log('\nFailed images (these still need a real photo uploaded manually):');
    failedUrls.forEach(({ product, url }) => console.log(`  - ${product}: ${url}`));
  }

  process.exit(0);
};

run().catch((error) => {
  console.error('Migration script crashed:', error);
  process.exit(1);
});