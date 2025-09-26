export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "OffWeGo");

  const response = await fetch("https://api.cloudinary.com/v1_1/do3si04h8/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.secure_url) {
    console.error("Cloudinary upload failed:", data);
    throw new Error("Upload failed");
  }

 
  return data.secure_url;
};
