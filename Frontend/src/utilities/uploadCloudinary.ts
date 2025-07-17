// export const uploadToCloudinary = async (file: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "your_unsigned_preset"); // use actual preset name

//   const response = await fetch(
//     "https://api.cloudinary.com/do3si04h8/offwego/upload", // <-- your actual cloud name here
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!response.ok) throw new Error("Upload failed");
//   const data = await response.json();
//   return data.secure_url;
// };
