import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinay = async(localFilePath) => {

  try {

    if (! localFilePath) return null;
  // upload file
     const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type : "auto"
    })

    console.log("file uploaded on cloudinary " , response.url);
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath)    // it will remove the locallu saved file as the upload opration
                                   // got faild
    return null; 
  }
  
}

export {uploadOnCloudinay}