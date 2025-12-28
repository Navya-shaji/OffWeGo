type CloudinaryResourceType = "image" | "video" | "raw";

const getCloudinaryConfig = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
    | string
    | undefined;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  return { cloudName, uploadPreset };
};

export const resolveCloudinaryUrl = (
  value: string | undefined | null,
  resourceType: CloudinaryResourceType = "image"
): string | undefined => {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) ?? "";
  if (!cloudName) return trimmed;

  const publicId = trimmed.replace(/^\//, "");
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${publicId}`;
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const resourceType: CloudinaryResourceType = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("image/")
      ? "image"
      : "raw";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Cloudinary upload failed");
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed: missing secure_url");
  }

  return data.secure_url;
};
