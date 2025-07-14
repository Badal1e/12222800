import urlModel from '../models/urlModel.js';
import logger from '../../logging-middleware/logger.mjs';

export class URLController {
  // Create shortened URL
  async createShortUrl(req, res) {
    try {
      const { url, validity, shortcode } = req.body;

      logger.log('backend', 'info', 'controller', `Creating short URL for: ${url}`);

      // Validate required fields
      if (!url) {
        logger.log('backend', 'warn', 'controller', 'URL is required but not provided');
        return res.status(400).json({
          error: true,
          message: 'URL is required'
        });
      }

      // Validate validity if provided
      if (validity !== undefined) {
        if (!Number.isInteger(validity) || validity <= 0) {
          logger.log('backend', 'warn', 'controller', 'Invalid validity value provided');
          return res.status(400).json({
            error: true,
            message: 'Validity must be a positive integer representing minutes'
          });
        }
      }

      const result = await urlModel.createUrl(url, validity, shortcode);

      logger.log('backend', 'info', 'controller', `Successfully created short URL: ${result.shortcode}`);

      res.status(201).json({
        shortLink: result.shortLink,
        expiry: result.expiry
      });

    } catch (error) {
      logger.log('backend', 'error', 'controller', `Error creating short URL: ${error.message}`);

      const statusCode = error.message.includes('Invalid URL') ? 400 :
        error.message.includes('already exists') ? 409 :
          error.message.includes('alphanumeric') ? 400 :
            error.message.includes('between 3 and 20') ? 400 : 500;

      res.status(statusCode).json({
        error: true,
        message: error.message
      });
    }
  }

  // Get URL statistics
  async getUrlStats(req, res) {
    try {
      const { shortcode } = req.params;

      logger.log('backend', 'info', 'controller', `Fetching stats for shortcode: ${shortcode}`);

      const stats = await urlModel.getUrlStats(shortcode);

      if (!stats) {
        logger.log('backend', 'warn', 'controller', `Shortcode not found: ${shortcode}`);
        return res.status(404).json({
          error: true,
          message: 'Shortcode not found'
        });
      }

      logger.log('backend', 'info', 'controller', `Successfully retrieved stats for: ${shortcode}`);

      res.json(stats);

    } catch (error) {
      logger.log('backend', 'error', 'controller', `Error fetching stats: ${error.message}`);

      res.status(500).json({
        error: true,
        message: 'Internal server error'
      });
    }
  }

  // Get all URLs (for frontend)
  async getAllUrls(req, res) {
    try {
      logger.log('backend', 'info', 'controller', 'Fetching all URLs');

      const urls = await urlModel.getAllUrls();

      logger.log('backend', 'info', 'controller', `Retrieved ${urls.length} URLs`);

      res.json(urls);

    } catch (error) {
      logger.log('backend', 'error', 'controller', `Error fetching all URLs: ${error.message}`);

      res.status(500).json({
        error: true,
        message: 'Internal server error'
      });
    }
  }
}

export default new URLController();