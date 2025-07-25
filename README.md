# \# URL Shortener Application

# 

# A full-stack URL shortener application built with a React frontend and Node.js backend, featuring comprehensive logging integration.

# 

# ---

# 

# \## 📁 Project Structure

# 

# ```

# 

# ├── logging-middleware/       # Reusable logging middleware

# │   └── logger.js             # Main logging functionality

# ├── backend/                  # Node.js/Express backend

# │   ├── controllers/          # Route controllers

# │   ├── models/               # Data models

# │   ├── routes/               # API routes

# │   └── server.js             # Main server file

# ├── frontend/                 # React frontend

# │   ├── public/               # Static assets

# │   ├── src/                  # React source files

# │   │   ├── components/       # Reusable components

# │   │   ├── pages/            # Page components

# │   │   ├── services/         # API services

# │   │   └── App.tsx           # Main app component

# │   ├── index.html            # Entry HTML

# │   ├── package.json          # Frontend dependencies

# │   ├── vite.config.ts        # Vite config

# 

# ````

# 

# ---

# 

# \## ✨ Features

# 

# \### 🔧 Backend

# \- RESTful API for URL shortening

# \- Custom \& automatic shortcode generation

# \- Click tracking \& analytics

# \- Robust error handling

# \- Request/response logging

# 

# \### 💻 Frontend

# \- Built with React \& Material UI

# \- Shorten up to 5 URLs at once

# \- Real-time form validation

# \- Dashboard with detailed stats

# 

# \### 🧩 Logging Integration

# \- Custom middleware

# \- Integration with test server

# \- Full error and performance logging

# 

# ---

# 

# \## 🧪 API Endpoints

# 

# \### ➕ Create Short URL

# ```http

# POST /shorturls

# {

# &nbsp; "url": "https://example.com/very-long-url",

# &nbsp; "validity": 30,

# &nbsp; "shortcode": "custom123"

# }

# ````

# 

# \### 📊 Get URL Statistics

# 

# ```http

# GET /shorturls/:shortcode

# ```

# 

# \### 📋 Get All URLs

# 

# ```http

# GET /shorturls

# ```

# 

# ---

# 

# \## 🚀 Setup Instructions

# 

# 1\. \*\*Register with Test Server\*\*

# 

# &nbsp;  \* Use your university email and roll number

# &nbsp;  \* Save your `clientId` and `clientSecret`

# 

# 2\. \*\*Configure Logger\*\*

# 

# &nbsp;  \* Update `CLIENT\_ID` and `CLIENT\_SECRET` in:

# 

# &nbsp;    \* `backend/server.js`

# &nbsp;    \* `frontend/src/App.tsx`

# &nbsp;    \* `logging-middleware/logger.js`

# 

# 3\. \*\*Install Dependencies\*\*

# 

# ```bash

# cd frontend \&\& npm install

# cd ../backend \&\& npm install

# ```

# 

# 4\. \*\*Run the App\*\*

# 

# ```bash

# \# From project root

# npm run dev

# 

# \# Or run separately

# cd backend \&\& npm run dev

# cd ../frontend \&\& npm run dev

# ```

# 

# ---

# 

# \## 📈 Usage

# 

# 1\. \*\*URL Shortening\*\*

# 

# &nbsp;  \* Navigate to home page

# &nbsp;  \* Enter up to 5 URLs

# &nbsp;  \* Set validity and custom shortcodes (optional)

# &nbsp;  \* Click "Shorten URLs"

# 

# 2\. \*\*Analytics\*\*

# 

# &nbsp;  \* Visit Statistics page

# &nbsp;  \* View click counts and URL stats

# &nbsp;  \* Expand rows to view individual click details

# 

# ---

# 

# \## ⚙️ Tech Stack

# 

# \* \*\*Backend\*\*: Node.js, Express

# \* \*\*Frontend\*\*: React, TypeScript, Material UI

# \* \*\*Logging\*\*: Custom middleware

# \* \*\*Storage\*\*: In-memory (temporary)

# \* \*\*Validation\*\*: Server-side \& client-side

# 

# ---

# 

# \## 📦 Production Considerations

# 

# \* Switch to persistent DB (e.g. MongoDB/PostgreSQL)

# \* Add rate limiting, auth \& token handling

# \* Use Redis for caching

# \* Add environment variable management

# \* Integrate testing (unit + integration)

# 

# ---

# 

# \## 🙋‍♂️ Author

# 

# \*\*Badal Kumar\*\*

# 

# \* 🌐 \[Portfolio](https://my-portfolio-one-topaz-58.vercel.app)

# \* 💼 \[LinkedIn](https://www.linkedin.com/in/badalk1)

# \* 💻 \[GitHub](https://github.com/badal1e)

# \* 📫 Email: \[rajbaadal63@gmail.com](mailto:rajbaadal63@gmail.com)

# 

# ````

# 

# ---

# 

# Copy the full content above, paste it into your `README.md`, save, and then:

# 

# ```bash

# git add README.md

# git commit -m "Updated polished README"

# git push origin main

# 

