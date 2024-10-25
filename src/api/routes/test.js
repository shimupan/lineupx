import express from 'express';

const router = express.Router();

router.get('/test', async (req, res) => {
   try {
      console.log("test endpoint");
      res.status(200).json({ message: 'All good', expires_in: 600, "access_token": "qeweqrwr", "refresh_token": "rrretetett" });
   }
   catch (error){
      console.error('error', error);
      res.status(500).json({ message: 'Error' });
   }
})

export default router;
