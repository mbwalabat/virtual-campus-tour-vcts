const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

// Sign upload parameters for direct-to-Cloudinary uploads
router.post('/sign', authenticate, isAdmin, async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = req.body.folder || 'locations';
    const paramsToSign = { timestamp, folder }; // more params can be added client-side (eager, public_id, etc.)
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      data: {
        timestamp,
        signature,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
      }
    });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    res.status(500).json({ success: false, message: 'Failed to sign upload' });
  }
});

module.exports = router;


