import { v2 as Cloudinary } from 'cloudinary';

const cloudinary = () => {
   try {
      Cloudinary.config({
         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_SECRET,
      });
      console.log('Cloudinary config loaded');
      return Cloudinary;
   } catch (error) {
      console.error('Failed to load Cloudinary config:', error);
   }
};

export default cloudinary;
