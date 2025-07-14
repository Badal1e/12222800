import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

// In-memory storage (replace with database in production)
const urlDatabase = new Map();
const clickDatabase = new Map();

export class URLModel {
  constructor() {
    this.urls = urlDatabase;
    this.clicks = clickDatabase;
  }

  // Generate a unique shortcode
  generateShortcode(length = 6) {
    return nanoid(length);
  }

  // Validate URL format
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Create a new shortened URL
  async createUrl(originalUrl, validity = 30, customShortcode = null) {
    if (!this.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    let shortcode = customShortcode;
    
    // If custom shortcode provided, validate it
    if (customShortcode) {
      if (!/^[a-zA-Z0-9]+$/.test(customShortcode)) {
        throw new Error('Shortcode must be alphanumeric');
      }
      if (customShortcode.length < 3 || customShortcode.length > 20) {
        throw new Error('Shortcode must be between 3 and 20 characters');
      }
      if (this.urls.has(customShortcode)) {
        throw new Error('Shortcode already exists');
      }
    } else {
      // Generate unique shortcode
      do {
        shortcode = this.generateShortcode();
      } while (this.urls.has(shortcode));
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + validity * 60 * 1000);

    const urlData = {
      id: uuidv4(),
      originalUrl,
      shortcode,
      createdAt: now,
      expiryAt: expiry,
      clickCount: 0,
      isActive: true
    };

    this.urls.set(shortcode, urlData);
    this.clicks.set(shortcode, []);

    return {
      shortcode,
      shortLink: `http://localhost:8080/${shortcode}`,
      expiry: expiry.toISOString(),
      ...urlData
    };
  }

  // Get URL by shortcode
  async getUrl(shortcode) {
    const urlData = this.urls.get(shortcode);
    if (!urlData) {
      return null;
    }

    // Check if expired
    if (new Date() > urlData.expiryAt) {
      urlData.isActive = false;
      return null;
    }

    return urlData;
  }

  // Record a click
  async recordClick(shortcode, clickData) {
    const urlData = this.urls.get(shortcode);
    if (!urlData) {
      return false;
    }

    // Increment click count
    urlData.clickCount++;
    
    // Record click details
    const clickRecord = {
      id: uuidv4(),
      timestamp: new Date(),
      referrer: clickData.referrer || 'direct',
      userAgent: clickData.userAgent || 'unknown',
      ip: clickData.ip || '127.0.0.1',
      location: this.getLocationFromIP(clickData.ip)
    };

    const clicks = this.clicks.get(shortcode) || [];
    clicks.push(clickRecord);
    this.clicks.set(shortcode, clicks);

    return true;
  }

  // Get URL statistics
  async getUrlStats(shortcode) {
    const urlData = this.urls.get(shortcode);
    if (!urlData) {
      return null;
    }

    const clicks = this.clicks.get(shortcode) || [];

    return {
      shortcode,
      originalUrl: urlData.originalUrl,
      shortLink: `http://localhost:8080/${shortcode}`,
      createdAt: urlData.createdAt,
      expiryAt: urlData.expiryAt,
      clickCount: urlData.clickCount,
      isActive: urlData.isActive,
      clicks: clicks.map(click => ({
        timestamp: click.timestamp,
        referrer: click.referrer,
        location: click.location
      }))
    };
  }

  // Get all URLs (for frontend statistics page)
  async getAllUrls() {
    const urls = [];
    for (const [shortcode, urlData] of this.urls) {
      const clicks = this.clicks.get(shortcode) || [];
      urls.push({
        shortcode,
        originalUrl: urlData.originalUrl,
        shortLink: `http://localhost:8080/${shortcode}`,
        createdAt: urlData.createdAt,
        expiryAt: urlData.expiryAt,
        clickCount: urlData.clickCount,
        isActive: urlData.isActive,
        clicks: clicks.map(click => ({
          timestamp: click.timestamp,
          referrer: click.referrer,
          location: click.location
        }))
      });
    }
    return urls;
  }

  // Simple IP to location mapping (replace with real geolocation service)
  getLocationFromIP(ip) {
    // Mock location data - in production, use a real geolocation service
    const mockLocations = [
      'New York, USA',
      'London, UK',
      'Tokyo, Japan',
      'Sydney, Australia',
      'Mumbai, India',
      'Berlin, Germany',
      'Toronto, Canada',
      'São Paulo, Brazil'
    ];
    
    return mockLocations[Math.floor(Math.random() * mockLocations.length)];
  }
}

export default new URLModel();