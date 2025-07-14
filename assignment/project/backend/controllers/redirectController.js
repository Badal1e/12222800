import urlModel from '../models/urlModel.js';
import logger from '../../logging-middleware/logger.mjs';

export async function redirectHandler(req, res) {
  try {
    const { shortcode } = req.params;

    logger.log('backend', 'info', 'handler', `Redirect request for shortcode: ${shortcode}`);

    const urlData = await urlModel.getUrl(shortcode);

    if (!urlData) {
      logger.log('backend', 'warn', 'handler', `Shortcode not found or expired: ${shortcode}`);
      return res.status(404).json({
        error: true,
        message: 'Short URL not found or has expired'
      });
    }

    // Record the click
    const clickData = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer')
    };

    await urlModel.recordClick(shortcode, clickData);

    logger.log('backend', 'info', 'handler', `Redirecting ${shortcode} to ${urlData.originalUrl}`);

    // Redirect to original URL
    res.redirect(302, urlData.originalUrl);

  } catch (error) {
    logger.log('backend', 'error', 'handler', `Error in redirect: ${error.message}`);

    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
}