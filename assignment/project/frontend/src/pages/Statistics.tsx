import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { logger } from '../../logging-middleware/browser-logger.js';
import { getAllUrls } from '../services/api';

interface ClickData {
  timestamp: string;
  referrer: string;
  location: string;
}

interface URLStats {
  shortcode: string;
  originalUrl: string;
  shortLink: string;
  createdAt: string;
  expiryAt: string;
  clickCount: number;
  isActive: boolean;
  clicks: ClickData[];
}

const Statistics: React.FC = () => {
  const [urls, setUrls] = useState<URLStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    logger.log('frontend', 'info', 'page', 'Statistics page loaded');
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      logger.log('frontend', 'info', 'api', 'Fetching URL statistics');
      
      const data = await getAllUrls();
      setUrls(data);
      
      logger.log('frontend', 'info', 'api', `Retrieved ${data.length} URLs`);
    } catch (error: any) {
      logger.log('frontend', 'error', 'api', `Error fetching statistics: ${error.message}`);
      setError(error.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (shortcode: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(shortcode)) {
      newExpanded.delete(shortcode);
    } else {
      newExpanded.add(shortcode);
    }
    setExpandedRows(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    logger.log('frontend', 'info', 'page', 'URL copied to clipboard');
  };

  const getStatusBadge = (isActive: boolean, expiryAt: string) => {
    const isExpired = new Date() > new Date(expiryAt);
    if (isExpired) {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Expired</span>;
    }
    if (isActive) {
      return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Active</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Inactive</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">URL Statistics</h1>
          <button
            onClick={fetchStatistics}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {urls.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No URLs found. Create some shortened URLs first!
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total URLs</h3>
                <p className="text-3xl font-bold text-blue-600">{urls.length}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Clicks</h3>
                <p className="text-3xl font-bold text-green-600">
                  {urls.reduce((total, url) => total + url.clickCount, 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active URLs</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {urls.filter(url => url.isActive && new Date() < new Date(url.expiryAt)).length}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <React.Fragment key={url.shortcode}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {url.shortcode}
                            </code>
                            <button
                              onClick={() => copyToClipboard(url.shortLink)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={url.originalUrl}>
                            {url.originalUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(url.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(url.expiryAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(url.isActive, url.expiryAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {url.clickCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleRowExpansion(url.shortcode)}
                            disabled={url.clicks.length === 0}
                            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            {expandedRows.has(url.shortcode) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      
                      {url.clicks.length > 0 && expandedRows.has(url.shortcode) && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800">Click Details</h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {url.clicks.map((click, index) => (
                                      <tr key={index}>
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                          {new Date(click.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                          {click.referrer || 'Direct'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                          {click.location}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;