const cloudinary = require("cloudinary").v2;

exports.uploadVideoToCloudinary = async (file, folderName) => {
  try {
    const options = {
      folder: folderName,
      resource_type: "video",
    };

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    throw error;
  }
};
