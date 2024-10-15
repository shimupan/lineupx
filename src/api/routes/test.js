import express from 'express';

const router = express.Router();

router.get('/test', async (req, res) => {
   try {
      console.log("test endpoint");
      res.status(200).json({ message: 'All good' });
   }
   catch (error){
      console.error('error', error);
      res.status(500).json({ message: 'Error' });
   }
})

export default router;
