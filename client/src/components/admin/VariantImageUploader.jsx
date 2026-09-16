import { useState } from "react";
import { Trash2, ArrowUpDown, ImagePlus, Loader2, X } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Variant image gallery. `images` are real, already-uploaded Cloudinary
// images ({ id, imageUrl, thumbnailUrl, publicId, altText, isPrimary,
// sortOrder }). `queuedFiles` are Files picked before the product (and this
// variant) exist yet — they have nowhere to upload to until the product is
// created, so they're just held and previewed locally.
//
// - `uploadFn`/`removeFn` present -> the product+variant already exist:
//   new files upload immediately, removals hit the real delete endpoint
//   immediately, both via the real Cloudinary-backed endpoints.
// - absent -> no ids yet: new files are queued via `onQueuedFilesChange`
//   and uploaded by the parent right after the product is created.
export default function VariantImageUploader({
  images,
  onImagesChange,
  queuedFiles = [],
  onQueuedFilesChange,
  uploadFn,
  removeFn,
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const normalizedImages = images.map((image, index) => ({
    id: image.id || image.publicId || `img-${index}`,
    imageUrl: image.imageUrl || image.url || image.thumbnailUrl || "",
    thumbnailUrl: image.thumbnailUrl || image.imageUrl || image.url || "",
    publicId: image.publicId,
    altText: image.altText || `Image ${index + 1}`,
    isPrimary: Boolean(image.isPrimary),
    sortOrder: Number(image.sortOrder ?? index),
  }));

  const processFiles = async (fileList) => {
    const files = Array.from(fileList).filter((file) => ACCEPTED_TYPES.includes(file.type));
    if (!files.length) return;

    if (!uploadFn) {
      onQueuedFilesChange([...queuedFiles, ...files]);
      return;
    }

    setUploading(true);
    try {
      const nextImages = await uploadFn(files);
      onImagesChange(nextImages);
      toast.success("Variant images uploaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload variant images");
    } finally {
      setUploading(false);
    }
  };

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
    onImagesChange(next.map((img, idx) => ({ ...img, sortOrder: idx })));
  };

  const togglePrimary = (index) => {
    onImagesChange(normalizedImages.map((img, idx) => ({ ...img, isPrimary: idx === index })));
  };

  const removeImage = async (index) => {
    const image = normalizedImages[index];
    if (removeFn && image.publicId) {
      setRemovingId(image.publicId);
      try {
        const nextImages = await removeFn(image.publicId);
        onImagesChange(nextImages);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to remove image");
      } finally {
        setRemovingId(null);
      }
      return;
    }
    onImagesChange(normalizedImages.filter((_, idx) => idx !== index).map((img, idx) => ({ ...img, sortOrder: idx })));
  };

  const removeQueuedFile = (index) => {
    onQueuedFilesChange(queuedFiles.filter((_, idx) => idx !== index));
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
          "relative rounded-[var(--radius-md)] border border-dashed p-4 text-center transition-colors",
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
            {uploading ? "Uploading..." : "Upload images"}
            <input type="file" accept={ACCEPTED_TYPES.join(",")} multiple className="sr-only" onChange={handleFileChange} disabled={uploading} />
          </label>
          <p className="text-xs text-charcoal-500">Supports JPG, PNG, WebP. Uploaded directly to Cloudinary.</p>
        </div>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-md)] bg-white/70">
            <Loader2 size={22} className="animate-spin text-orchard-900" />
          </div>
        )}
      </div>

      {!uploadFn && queuedFiles.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-500">Pending upload (saved once the product is created)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {queuedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative rounded-[var(--radius-md)] border border-border p-2 bg-linen-50">
                <img src={URL.createObjectURL(file)} alt={file.name} className="h-32 w-full rounded-[var(--radius-sm)] object-cover" />
                <button
                  type="button"
                  onClick={() => removeQueuedFile(index)}
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-1 text-charcoal-900 hover:bg-white"
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {normalizedImages.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {normalizedImages.map((image, index) => (
            <div key={image.id} className="group rounded-[var(--radius-md)] border border-border p-2 bg-linen-50">
              <div className="relative overflow-hidden rounded-[var(--radius-md)]">
                <img src={image.thumbnailUrl || image.imageUrl} alt={image.altText} className="h-40 w-full object-cover" />
                {image.isPrimary && (
                  <span className="absolute left-2 top-2 bg-orchard-900 text-white text-[11px] uppercase tracking-[0.2em] px-2 py-1 rounded-[var(--radius-sm)]">Primary</span>
                )}
                {removingId === image.publicId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 size={18} className="animate-spin text-orchard-900" />
                  </div>
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
                <button type="button" onClick={() => removeImage(index)} disabled={removingId === image.publicId} className="rounded-[var(--radius-md)] border border-danger-600 px-3 py-2 text-xs font-semibold text-danger-600 hover:bg-danger-50 disabled:opacity-50">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-charcoal-600">
                <button type="button" onClick={() => moveImage(index, Math.max(0, index - 1))} disabled={index === 0} className="rounded-[var(--radius-sm)] px-2 py-1 bg-white border border-border-strong hover:bg-linen-50 disabled:opacity-50">
                  ↑
                </button>
                <button type="button" onClick={() => moveImage(index, Math.min(normalizedImages.length - 1, index + 1))} disabled={index === normalizedImages.length - 1} className="rounded-[var(--radius-sm)] px-2 py-1 bg-white border border-border-strong hover:bg-linen-50 disabled:opacity-50">
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
