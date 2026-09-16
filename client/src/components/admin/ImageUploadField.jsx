import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Single-image upload field used for a product's main image, a category
// image, and a brand logo. `value` is either a real image URL (string, once
// uploaded) or a queued File (picked before the parent record exists).
//
// - `uploadFn` present -> the parent record already exists: the file is
//   uploaded immediately via the real Cloudinary endpoint, and `onChange`
//   receives the resulting URL.
// - `uploadFn` absent -> no record id yet: the File is handed to `onChange`
//   as-is so the parent can hold it and upload it right after create.
export default function ImageUploadField({
  value,
  onChange,
  uploadFn,
  label = "Image",
  successMessage = "Image uploaded",
  errorMessage = "Failed to upload image",
  queuedHint = "This image will be uploaded once the record is saved.",
}) {
  const [uploading, setUploading] = useState(false);

  const isQueuedFile = value instanceof File;
  const previewUrl = useMemo(() => {
    if (!value) return "";
    return isQueuedFile ? URL.createObjectURL(value) : value;
  }, [value, isQueuedFile]);

  useEffect(() => {
    if (!isQueuedFile || !previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [isQueuedFile, previewUrl]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = null;
    if (!file) return;

    if (!uploadFn) {
      onChange(file);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFn(file);
      onChange(url);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error?.response?.data?.message || errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-charcoal-900">{label}</span>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-linen-50 flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} className="text-charcoal-300" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 size={18} className="animate-spin text-orchard-900" />
            </div>
          )}
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center rounded-[var(--radius-md)] border border-border-strong bg-white px-3 py-2 text-sm font-semibold text-orchard-900 hover:bg-linen-50">
            {uploading ? "Uploading..." : previewUrl ? "Change image" : "Upload image"}
            <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={uploading} />
          </label>
          {isQueuedFile && <p className="mt-1.5 text-xs text-charcoal-500">{queuedHint}</p>}
        </div>
      </div>
    </div>
  );
}
