export const uploadToCloudinary = async (imageUri) => {
  const cloudName = "dac9ao4zb";           // my cloud name
  const uploadPreset = "wallet-upload";    // my unsigned preset

  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return { success: true, url: data.secure_url, raw: data };
    } else {
      return { success: false, message: data };
    }
  } catch (err) {
    console.log("Cloudinary upload error:", err);
    return { success: false, message: err.message || "Upload failed" };
  }
};
