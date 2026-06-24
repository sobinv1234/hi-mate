import { uploadImage as cloudinaryUpload } from "./cloudinary";
// import { uploadImage as awsUpload } from "./aws";

const provider = "cloudinary"; // change this later

const providers = {
    cloudinary: cloudinaryUpload,
    // aws: awsUpload,
};

export const uploadImage = providers[provider];