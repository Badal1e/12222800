import axios from 'axios';
import { logger } from '../../logging-middleware/browser-logger.js';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    logger.log('frontend', 'info', 'api', `API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.log('frontend', 'error', 'api', `API Request Error: ${error.message}`);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    logger.log('frontend', 'info', 'api', `API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    logger.log('frontend', 'error', 'api', `API Response Error: ${message}`);
    return Promise.reject(new Error(message));
  }
);

export interface CreateShortUrlRequest {
  url: string;
  validity?: number;
  shortcode?: string;
}

export interface CreateShortUrlResponse {
  shortLink: string;
  expiry: string;
}

export interface URLStats {
  shortcode: string;
  originalUrl: string;
  shortLink: string;
  createdAt: string;
  expiryAt: string;
  clickCount: number;
  isActive: boolean;
  clicks: Array<{
    timestamp: string;
    referrer: string;
    location: string;
  }>;
}

export const createShortUrl = async (data: CreateShortUrlRequest): Promise<CreateShortUrlResponse> => {
  try {
    const response = await api.post('/shorturls', data);
    return response.data;
  } catch (error) {
    logger.log('frontend', 'error', 'api', `Failed to create short URL: ${error}`);
    throw error;
  }
};

export const getUrlStats = async (shortcode: string): Promise<URLStats> => {
  try {
    const response = await api.get(`/shorturls/${shortcode}`);
    return response.data;
  } catch (error) {
    logger.log('frontend', 'error', 'api', `Failed to get URL stats: ${error}`);
    throw error;
  }
};

export const getAllUrls = async (): Promise<URLStats[]> => {
  try {
    const response = await api.get('/shorturls');
    return response.data;
  } catch (error) {
    logger.log('frontend', 'error', 'api', `Failed to get all URLs: ${error}`);
    throw error;
  }
};