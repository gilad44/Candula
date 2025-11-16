# Candula Deployment Guide for Render.com

## Prerequisites

- MongoDB Atlas account (for database)
- Render.com account
- Google OAuth credentials (optional)
- OpenAI API key (for AI features)

## Setup Steps

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Whitelist Render.com IPs (or allow access from anywhere: 0.0.0.0/0)

### 2. Deploy to Render.com

#### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect `render.yaml`
4. Set the required environment variables in Render dashboard:

**Backend Environment Variables:**

- `DB_NAME` - Your MongoDB connection string
- `DB_PASSWORD` - Your MongoDB password (if separate)
- `ADMIN_EMAIL` - Initial admin email
- `ADMIN_PASSWORD` - Initial admin password (min 8 chars, uppercase, lowercase, number, special char)

**Frontend Environment Variables:**

- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `VITE_OPENAI_API_KEY` - OpenAI API key for AI features

#### Option B: Manual Setup

1. Create a new Web Service for Backend:

   - Build Command: `cd Backend && npm install`
   - Start Command: `cd Backend && npm start`
   - Set environment variables as above

2. Create a new Static Site for Frontend:
   - Build Command: `cd Frontend && npm install && npm run build`
   - Publish Directory: `Frontend/dist`
   - Set `VITE_API_BASE_URL` to your backend URL

### 3. Environment Variables Details

#### Required Backend Variables:

```
NODE_ENV=production
PORT=9190
DB=MONGODB
DB_NAME=mongodb+srv://username:password@cluster.mongodb.net/candula
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!
TOKEN_GENERATOR=jwt
LOGGER=morgan
```

#### Required Frontend Variables:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional)
VITE_OPENAI_API_KEY=sk-proj-your_key (optional)
```

### 4. Post-Deployment

1. The backend will automatically create an admin user on first deployment
2. Test the API health endpoint: `https://your-backend-url.onrender.com/`
3. Test the frontend: `https://your-frontend-url.onrender.com`
4. Login with your admin credentials

### 5. Common Issues

**CORS Errors:**

- Make sure your frontend URL is whitelisted in Backend CORS settings
- Check `Backend/middleware/cors.js`

**Database Connection Failed:**

- Verify MongoDB connection string
- Check MongoDB Atlas network access settings
- Ensure IP whitelist includes Render IPs

**Admin Not Created:**

- Check logs for errors in `deploy-admin` script
- Verify ADMIN_EMAIL and ADMIN_PASSWORD are set correctly
- Password must meet complexity requirements

### 6. Monitoring

- Check logs in Render dashboard
- Backend logs are available under your Backend service
- Frontend builds are logged during deployment

## Security Notes

1. **Never commit `.env` files** - they are gitignored
2. Store all secrets in Render environment variables
3. Use strong passwords for admin account
4. Regularly rotate API keys
5. Keep dependencies updated

## Local Development

```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

## Support

For issues, check:

- Render logs
- MongoDB Atlas logs
- Browser console for frontend errors
