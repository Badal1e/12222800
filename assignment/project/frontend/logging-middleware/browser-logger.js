// Simple browser logger middleware
export const logger = {
  init: async (clientId, clientSecret) => {
    // Dummy async init for frontend
    return Promise.resolve();
  },
  log: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Logger]", ...args);
    }
  },
  error: (...args) => {
    console.error("[Logger ERROR]", ...args);
  },
  warn: (...args) => {
    console.warn("[Logger WARN]", ...args);
  },
};
