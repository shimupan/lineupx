import { v2 as Cloudinary } from 'cloudinary';

const cloudinary = () => {
   Cloudinary.config({
      cloud_name: 'ddwqqjmyo',
      api_key: '729538293426867',
      api_secret: process.env.CLOUDINARY_SECRET,
   });
};

export default cloudinary;
