const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateUploadSignature = () => {
    const timestamp = Math.floor(Date.now() / 1000); // Convert this into seconds

    //timestamp and other attributes that we'll send from client will be used
    // by cloudinary to reconstruct the signature and compare it with the signature
    // we're passing.
    const signature = cloudinary.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_API_SECRET
    );

    return { signature, timestamp};
};

module.exports = { generateUploadSignature };