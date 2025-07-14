import React, { useState } from 'react';
import { Plus, Minus, Copy, CheckCircle } from 'lucide-react';
import { logger } from '../../logging-middleware/browser-logger.js';
import { createShortUrl } from '../services/api';

interface URLEntry {
  id: string;
  url: string;
  validity: string;
  shortcode: string;
  shortLink?: string;
  expiry?: string;
  error?: string;
  loading?: boolean;
}

const URLShortener: React.FC = () => {
  const [urls, setUrls] = useState<URLEntry[]>([
    { id: '1', url: '', validity: '30', shortcode: '' }
  ]);
  const [globalError, setGlobalError] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  React.useEffect(() => {
    logger.log('frontend', 'info', 'page', 'URL Shortener page loaded');
  }, []);

  const addUrlEntry = () => {
    if (urls.length < 5) {
      const newEntry: URLEntry = {
        id: Date.now().toString(),
        url: '',
        validity: '30',
        shortcode: ''
      };
      setUrls([...urls, newEntry]);
      logger.log('frontend', 'info', 'page', 'New URL entry added');
    }
  };

  const removeUrlEntry = (id: string) => {
    if (urls.length > 1) {
      setUrls(urls.filter(entry => entry.id !== id));
      logger.log('frontend', 'info', 'page', `URL entry ${id} removed`);
    }
  };

  const updateUrlEntry = (id: string, field: keyof URLEntry, value: string) => {
    setUrls(urls.map(entry => 
      entry.id === id ? { ...entry, [field]: value, error: '' } : entry
    ));
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEntry = (entry: URLEntry): string | null => {
    if (!entry.url.trim()) {
      return 'URL is required';
    }
    if (!validateUrl(entry.url)) {
      return 'Please enter a valid URL';
    }
    if (entry.validity && (!Number.isInteger(Number(entry.validity)) || Number(entry.validity) <= 0)) {
      return 'Validity must be a positive integer';
    }
    if (entry.shortcode && (entry.shortcode.length < 3 || entry.shortcode.length > 20)) {
      return 'Shortcode must be between 3 and 20 characters';
    }
    if (entry.shortcode && !/^[a-zA-Z0-9]+$/.test(entry.shortcode)) {
      return 'Shortcode must be alphanumeric';
    }
    return null;
  };

  const handleSubmit = async () => {
    setGlobalError('');
    logger.log('frontend', 'info', 'page', 'Starting URL shortening process');

    // Validate all entries
    const validationErrors: { [key: string]: string } = {};
    urls.forEach(entry => {
      const error = validateEntry(entry);
      if (error) {
        validationErrors[entry.id] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setUrls(urls.map(entry => ({
        ...entry,
        error: validationErrors[entry.id] || ''
      })));
      logger.log('frontend', 'warn', 'page', 'Validation errors found');
      return;
    }

    // Set loading state
    setUrls(urls.map(entry => ({ ...entry, loading: true })));

    // Process each URL
    for (const entry of urls) {
      try {
        logger.log('frontend', 'info', 'api', `Shortening URL: ${entry.url}`);
        
        const response = await createShortUrl({
          url: entry.url,
          validity: Number(entry.validity),
          shortcode: entry.shortcode || undefined
        });

        setUrls(prevUrls => prevUrls.map(u => 
          u.id === entry.id ? {
            ...u,
            shortLink: response.shortLink,
            expiry: response.expiry,
            loading: false
          } : u
        ));

        logger.log('frontend', 'info', 'api', `Successfully shortened: ${entry.url}`);
      } catch (error: any) {
        logger.log('frontend', 'error', 'api', `Error shortening URL: ${error.message}`);
        
        setUrls(prevUrls => prevUrls.map(u => 
          u.id === entry.id ? {
            ...u,
            error: error.message || 'Failed to create short URL',
            loading: false
          } : u
        ));
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard!' });
    logger.log('frontend', 'info', 'page', 'URL copied to clipboard');
    setTimeout(() => setSnackbar({ open: false, message: '' }), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Shortener</h1>
        <p className="text-gray-600 mb-6">
          Create up to 5 shortened URLs simultaneously. Enter your long URLs, set validity periods, and optionally provide custom shortcodes.
        </p>

        {globalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {globalError}
          </div>
        )}

        <div className="space-y-4">
          {urls.map((entry, index) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">URL {index + 1}</h3>
                {urls.length > 1 && (
                  <button
                    onClick={() => removeUrlEntry(entry.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={entry.url}
                    onChange={(e) => updateUrlEntry(entry.id, 'url', e.target.value)}
                    disabled={entry.loading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      entry.error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {entry.error && (
                    <p className="text-red-500 text-sm mt-1">{entry.error}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validity (minutes)
                  </label>
                  <input
                    type="number"
                    value={entry.validity}
                    onChange={(e) => updateUrlEntry(entry.id, 'validity', e.target.value)}
                    disabled={entry.loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Shortcode (optional)
                </label>
                <input
                  type="text"
                  placeholder="mycode"
                  value={entry.shortcode}
                  onChange={(e) => updateUrlEntry(entry.id, 'shortcode', e.target.value)}
                  disabled={entry.loading}
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {entry.shortLink && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="text-green-800 font-medium">Short URL created successfully!</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={entry.shortLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => copyToClipboard(entry.shortLink!)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
                    >
                      <Copy size={16} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Expires: {new Date(entry.expiry!).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={addUrlEntry}
            disabled={urls.length >= 5}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Add URL ({urls.length}/5)</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={urls.some(entry => entry.loading)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {urls.some(entry => entry.loading) ? 'Processing...' : 'Shorten URLs'}
          </button>
        </div>
      </div>

      {snackbar.open && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default URLShortener;