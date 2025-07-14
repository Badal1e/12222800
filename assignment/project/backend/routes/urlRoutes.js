import express from 'express';
import urlController from '../controllers/urlController.js';

const router = express.Router();

// Create short URL
router.post('/', urlController.createShortUrl);

// Get URL statistics
router.get('/:shortcode', urlController.getUrlStats);

// Get all URLs (for frontend)
router.get('/', urlController.getAllUrls);

export default router;