const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folderName, height, quality) => {
  try {
    const options = {
        folder: folderName,
    };

    if (height) {
        options.height = height;
        options.crop = "scale";
    }

    if (quality) {
        options.quality = quality;
    }
    
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

exports.deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};