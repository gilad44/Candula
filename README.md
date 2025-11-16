# Candula - נרות דקורטיביים ריחניים

## 🎓 For School Testing/Demo

### Quick Admin Access:

- **Email:** `admin@test.com`
- **Password:** `Admin123!`

### How to Test Admin Features:

1. Login with admin credentials
2. Look for "ניהול מערכת" in the navigation bar
3. Access admin dashboard and order management

### Regular User Testing:

- **Email:** `regular@gmail.com`
- **Password:** `Regular123!`

### 📋 Environment Setup for Testers:

**IMPORTANT:** You need to set up environment variables before running:

1. **Backend Setup:**

   ```bash
   cd Backend
   cp .env.example development.env
   # Edit development.env and add your MongoDB connection string
   # Or use a local MongoDB: mongodb://localhost:27017/Candula
   ```

2. **Frontend Setup:**

   ```bash
   cd Frontend
   cp .env.example .env
   # Edit .env - most features work without API keys
   # For Google Login: Add your VITE_GOOGLE_CLIENT_ID
   # For AI features: Add your VITE_OPENAI_API_KEY (optional)
   ```

3. **Database:** The app needs MongoDB running locally OR a MongoDB Atlas connection string.

**Note:** See `.env.example` files in each folder for all configuration options.

---

## Development Setup

### Frontend (React + TypeScript + Vite)

```bash
cd Frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend (Node.js + Express + MongoDB)

```bash
cd Backend
npm install
npm run dev  # Development (port 8180)
npm start    # Production (port 9190)
```

### Features Implemented:

- ✅ User authentication with role-based access
- ✅ Product catalog with detailed views
- ✅ Shopping cart and checkout process
- ✅ Order management system
- ✅ Admin dashboard with order CRUD operations
- ✅ RTL Hebrew layout support
- ✅ Responsive design with Material-UI
- ✅ Daily rotating logs with automatic cleanup

### Admin Features:

- Order management (view, update status, delete)
- User management capabilities
- System statistics and dashboard
- Protected admin routes

### Logging System:

The backend includes comprehensive logging:

- **Daily log files**: `logs/access-DD-MM-YYYY.log`, `logs/app-DD-MM-YYYY.log`
- **Auto cleanup**: Removes logs older than 30 days
- **Multiple log types**: HTTP requests, application events, database operations
- **Console + File output**: Colored console logs for development

```javascript
// Manual logging example
const { logger } = require("./logger/appLogger");
logger.info("User action", { userId: 123 });
logger.error("Error occurred", { error: err.message });
```

---

**Educational Project - Candula Candle Store**
