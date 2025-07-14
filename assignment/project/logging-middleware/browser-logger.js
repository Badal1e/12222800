// Browser-compatible logging middleware
class BrowserLogger {
  constructor() {
    this.baseUrl = 'http://20.244.56.144/evaluation-service';
    this.token = null;
    this.clientId = null;
    this.clientSecret = null;
  }

  // Initialize with credentials
  init(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    return this.authenticate();
  }

  // Authenticate and get token
  async authenticate() {
    // Skip authentication if credentials are not properly configured
    if (!this.clientId || !this.clientSecret || 
        this.clientId === 'your-client-id-here' || 
        this.clientSecret === 'your-client-secret-here') {
      console.warn('Logger credentials not configured. Skipping authentication.');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'your-email@university.edu', // Replace with actual email
          name: 'Your Name', // Replace with actual name
          rollNo: 'your-roll-number', // Replace with actual roll number
          accessCode: 'your-access-code', // Replace with actual access code
          clientId: this.clientId,
          clientSecret: this.clientSecret
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access_token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  // Main logging function
  async log(stack, level, package_name, message) {
    // Skip logging if not properly initialized
    if (!this.clientId || this.clientId === 'your-client-id-here') {
      console.log(`[${stack}] [${level}] [${package_name}] ${message}`);
      return { success: false, reason: 'Logger not configured' };
    }

    // Validate inputs
    const validStacks = ['backend', 'frontend'];
    const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    const validPackages = {
      backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', 'auth', 'config', 'middleware', 'utils'],
      frontend: ['api', 'component', 'hook', 'page', 'state', 'styler', 'auth', 'config', 'middleware', 'utils']
    };

    if (!validStacks.includes(stack)) {
      console.error(`Invalid stack: ${stack}. Must be one of: ${validStacks.join(', ')}`);
      return { success: false, reason: 'Invalid stack' };
    }

    if (!validLevels.includes(level)) {
      console.error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
      return { success: false, reason: 'Invalid level' };
    }

    if (!validPackages[stack].includes(package_name)) {
      console.error(`Invalid package: ${package_name} for stack: ${stack}`);
      return { success: false, reason: 'Invalid package' };
    }

    // Ensure we have a valid token
    if (!this.token) {
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        console.warn('Authentication failed. Falling back to console logging.');
        console.log(`[${stack}] [${level}] [${package_name}] ${message}`);
        return { success: false, reason: 'Authentication failed' };
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          stack: stack,
          level: level,
          package: package_name,
          message: message
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        // If token expired, try to re-authenticate
        if (response.status === 401) {
          const authSuccess = await this.authenticate();
          if (authSuccess) {
            return this.log(stack, level, package_name, message);
          }
        }
        console.warn('Logging failed, falling back to console logging.');
        console.log(`[${stack}] [${level}] [${package_name}] ${message}`);
        return { success: false, reason: `Logging failed with status: ${response.status}` };
      }
    } catch (error) {
      console.error('Logging error:', error);
      console.log(`[${stack}] [${level}] [${package_name}] ${message}`);
      return { success: false, reason: error.message };
    }
  }
}

// Export singleton instance
export const logger = new BrowserLogger();

// Convenience function for easier usage
export function Log(stack, level, package_name, message) {
  return logger.log(stack, level, package_name, message);
}

export default logger;