import { useState, useCallback } from "react";
import { Plus, Trash2, ArrowUpDown, ImagePlus } from "lucide-react";
import clsx from "clsx";
import { readFileAsDataURL, compressImageFile, getThumbnailDataUrl } from "../../utils/imageUtils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function VariantImageUploader({ images, onChange }) {
  const [dragging, setDragging] = useState(false);

  const normalizedImages = images.map((image, index) => {
    if (typeof image === "string") {
      return {
        id: `img-${index}-${Date.now()}`,
        imageUrl: image,
        thumbnailUrl: image,
        altText: `Image ${index + 1}`,
        isPrimary: index === 0,
        sortOrder: index,
      };
    }
    return {
      id: image.id || `img-${index}-${Date.now()}`,
      imageUrl: image.imageUrl || image.url || image.thumbnailUrl || "",
      thumbnailUrl: image.thumbnailUrl || image.imageUrl || image.url || "",
      altText: image.altText || `Image ${index + 1}`,
      isPrimary: Boolean(image.isPrimary),
      sortOrder: Number(image.sortOrder ?? index),
    };
  });

  const processFiles = useCallback(
    async (files) => {
      const fileList = Array.from(files).filter((file) => ACCEPTED_TYPES.includes(file.type));
      if (!fileList.length) return;

      const processed = await Promise.all(
        fileList.map(async (file, index) => {
          const imageUrl = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
          const thumbnailUrl = await getThumbnailDataUrl(imageUrl, { maxSize: 320 });
          return {
            id: `img-${Date.now()}-${index}`,
            imageUrl,
            thumbnailUrl,
            altText: file.name,
            isPrimary: false,
            sortOrder: normalizedImages.length + index,
          };
        })
      );

      onChange([...normalizedImages, ...processed]);
    },
    [normalizedImages, onChange]
  );

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);
    await processFiles(event.dataTransfer.files);
  };

  const handleFileChange = async (event) => {
    await processFiles(event.target.files);
    event.target.value = null;
  };

  const moveImage = (fromIndex, toIndex) => {
    const next = [...normalizedImages];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next.map((img, idx) => ({ ...img, sortOrder: idx })));
  };

  const togglePrimary = (index) => {
    onChange(
      normalizedImages.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const removeImage = (index) => {
    onChange(normalizedImages.filter((_, idx) => idx !== index).map((img, idx) => ({ ...img, sortOrder: idx })));
  };

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          "rounded-[var(--radius-md)] border border-dashed p-4 text-center transition-colors",
          dragging ? "border-orchard-700 bg-orchard-50" : "border-border-strong bg-white"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-charcoal-600">
          <div className="h-12 w-12 rounded-full bg-linen-50 flex items-center justify-center text-orchard-900">
            <ImagePlus size={20} />
          </div>
          <p className="font-semibold text-charcoal-900">Drag & drop images here</p>
          <p>or</p>
          <label className="cursor-pointer rounded-[var(--radius-md)] border border-border-strong bg-white px-4 py-2 text-sm font-semibold text-orchard-900 hover:bg-linen-50">
            Upload images
            <input type="file" accept={ACCEPTED_TYPES.join(",")} multiple className="sr-only" onChange={handleFileChange} />
          </label>
          <p className="text-xs text-charcoal-500">Supports JPG, PNG, WebP. Compresses and generates thumbnails automatically.</p>
        </div>
      </div>

      {normalizedImages.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {normalizedImages.map((image, index) => (
            <div key={image.id} className="group rounded-[var(--radius-md)] border border-border p-2 bg-linen-50">
              <div className="relative overflow-hidden rounded-[var(--radius-md)]">
                <img src={image.thumbnailUrl || image.imageUrl} alt={image.altText} className="h-40 w-full object-cover" />
                {image.isPrimary && (
                  <span className="absolute left-2 top-2 bg-orchard-900 text-white text-[11px] uppercase tracking-[0.2em] px-2 py-1 rounded-[var(--radius-sm)]">Primary</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => togglePrimary(index)}
                  className={clsx(
                    "h-9 rounded-[var(--radius-md)] px-3 text-xs font-semibold transition-colors",
                    image.isPrimary ? "bg-orchard-900 text-white" : "bg-white border border-border-strong text-charcoal-900 hover:bg-orchard-50"
                  )}
                >
                  {image.isPrimary ? "Primary" : "Set Primary"}
                </button>
                <button type="button" onClick={() => removeImage(index)} className="rounded-[var(--radius-md)] border border-danger-600 px-3 py-2 text-xs font-semibold text-danger-600 hover:bg-danger-50">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-charcoal-600">
                <button type="button" onClick={() => moveImage(index, Math.max(0, index - 1))} disabled={index === 0} className="rounded-[var(--radius-sm)] px-2 py-1 bg-white border border-border-strong hover:bg-linen-50 disabled:opacity-50">
                  ↑
                </button>
                <button type="button" onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))} disabled={index === images.length - 1} className="rounded-[var(--radius-sm)] px-2 py-1 bg-white border border-border-strong hover:bg-linen-50 disabled:opacity-50">
                  ↓
                </button>
                <span className="flex items-center gap-1"><ArrowUpDown size={14} /> {index + 1}/{normalizedImages.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
