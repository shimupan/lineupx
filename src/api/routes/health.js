import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.status(200).json({
      status: 'OK',
      message: 'Server is running',
      dbStatus: dbStatus,
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'An error occurred while checking server health',
      error: error.message,
    });
  }
});

export default router;