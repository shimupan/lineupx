import express from 'express';

const router = express.Router();

router.delete('/logout', async (req, res) => {
   try {
    const { refreshToken } = req.body;
    if(!refreshToken) throw createError.BadRequest();
    //TODO AFTER VERIFY REFRESH TOKEN IS IMPLEMENTED
   }catch (err){
    next(err);
   }
});

export default router;