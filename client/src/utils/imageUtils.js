export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const compressImageFile = async (
  file,
  { maxWidth = 1400, maxHeight = 1400, quality = 0.78 } = {}
) => {
  const dataUrl = await readFileAsDataURL(file);
  const image = await loadImage(dataUrl);
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/webp', quality);
};

export const getThumbnailDataUrl = async (
  src,
  { maxSize = 320, quality = 0.72 } = {}
) => {
  const image = await loadImage(src);
  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/webp', quality);
};

export const normalizeImageObject = (image, index = 0) => {
  if (!image) return null;
  if (typeof image === 'string') {
    return {
      imageUrl: image,
      thumbnailUrl: image,
      altText: 'Product image',
      isPrimary: index === 0,
      sortOrder: index,
    };
  }

  return {
    imageUrl: image.imageUrl || image.url || '',
    thumbnailUrl: image.thumbnailUrl || image.thumbnailUrl || image.imageUrl || image.url || '',
    altText: image.altText || image.label || 'Product image',
    isPrimary: Boolean(image.isPrimary),
    sortOrder: Number(image.sortOrder ?? index),
  };
};

export const createImageObjectFromFile = async (
  file,
  { isPrimary = false, sortOrder = 0 } = {}
) => {
  const imageUrl = await compressImageFile(file);
  const thumbnailUrl = await getThumbnailDataUrl(imageUrl, { maxSize: 360 });
  return {
    imageUrl,
    thumbnailUrl,
    altText: file.name,
    isPrimary,
    sortOrder,
  };
};

export const normalizeImages = (images = []) => {
  return Array.isArray(images)
    ? images
        .map((image, index) => normalizeImageObject(image, index))
        .filter(Boolean)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];
};

export const ensurePrimaryImage = (images = []) => {
  if (!images.length) return images;
  if (images.some((image) => image.isPrimary)) return images;
  return images.map((image, index) => ({ ...image, isPrimary: index === 0 }));
};
