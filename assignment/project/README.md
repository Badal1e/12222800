# URL Shortener Application

A full-stack URL shortener application built with a React frontend and a Node.js backend, featuring comprehensive logging integration.

---

## 📁 Project Structure

```
├── logging-middleware/     # Reusable logging middleware
│   └── logger.js           # Main logging functionality
├── backend/                # Node.js/Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/                # React source files
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main app component
│   ├── index.html          # Entry HTML
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite config
│   └── ...                 # Other frontend config files
```

---

## ✨ Features

### 🔧 Backend
- RESTful API for URL shortening
- Custom shortcode support
- Automatic shortcode generation
- Click tracking and analytics
- Comprehensive error handling
- Request/response logging

### 💻 Frontend
- Material UI design system
- Concurrent URL shortening (up to 5 URLs)
- Real-time validation
- Statistics dashboard
- Responsive design
- Click analytics visualization

### 📊 Logging Integration
- Custom logging middleware
- Integration with test server
- Error tracking and performance monitoring

---

## 🔌 API Endpoints

### ➕ Create Short URL
```http
POST /shorturls
{
  "url": "https://example.com/very-long-url",
  "validity": 30,
  "shortcode": "custom123"
}
```

### 📊 Get URL Statistics
```http
GET /shorturls/:shortcode
```

### 📋 Get All URLs
```http
GET /shorturls
```

---

## 🛠 Setup Instructions

1. **Register with Test Server**
   - Use your university email and roll number
   - Save your `clientId` and `clientSecret`

2. **Configure Logger**
   - Update `CLIENT_ID` and `CLIENT_SECRET` in:
     - `backend/server.js`
     - `frontend/src/App.tsx`
     - `logging-middleware/logger.js`

3. **Install Dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

4. **Run the Application**
   ```bash
   # To run both frontend and backend concurrently (from project root)
   npm run dev

   # Or run separately:
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

---

## 🚀 Usage

### 🔗 URL Shortening
- Navigate to the home page
- Enter up to 5 URLs
- Set validity periods (default: 30 minutes)
- Optionally provide custom shortcodes
- Click "Shorten URLs"

### 📈 Statistics
- Navigate to the Statistics page
- View all shortened URLs
- See click counts and detailed analytics
- Expand rows to see individual click details

---

## ⚙️ Technical Details

- **Backend**: Node.js, Express (In-memory storage)
- **Frontend**: React, TypeScript, Material UI
- **Logging**: Custom middleware with test server integration
- **Validation**: Client-side & server-side
- **Error Handling**: Robust with proper HTTP status codes

---

## 📦 Production Considerations

- Replace in-memory storage with MongoDB/PostgreSQL
- Add rate limiting and authentication
- Implement caching for frequently accessed URLs
- Add monitoring and alerting
- Use environment variables for configuration
- Add unit and integration testing

---

> Built with 💻 by **Badal Kumar**
