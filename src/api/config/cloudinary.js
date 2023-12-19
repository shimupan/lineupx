import { v2 as Cloudinary } from 'cloudinary';

const cloudinary = () => {
   try {
      Cloudinary.config({
         cloud_name: 'ddwqqjmyo',
         api_key: '729538293426867',
         api_secret: process.env.CLOUDINARY_SECRET,
      });
      console.log('Cloudinary config loaded');
      return Cloudinary;
   } catch (error) {
      console.error('Failed to load Cloudinary config:', error);
   }
};

export default cloudinary;
