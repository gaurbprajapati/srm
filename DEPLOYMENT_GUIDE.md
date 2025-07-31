# Deployment Guide: Netlify (Frontend) + Render (Backend)

This guide will help you deploy your SRM application with the frontend on Netlify and backend on Render.

## 🚀 Prerequisites

1. GitHub account (both services support GitHub integration)
2. MongoDB Atlas account (for production database)
3. Netlify account
4. Render account

## 📊 Backend Deployment on Render

### Step 1: Prepare Your Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster or use an existing one
3. Create a database user
4. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

### Step 2: Deploy to Render

1. **Login to Render Dashboard**
   - Go to [render.com](https://render.com) and sign in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub repository
   - Select your repository and choose the `backend` directory as the root

3. **Configure Build Settings**
   - **Name**: `srm-backend` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or your preferred plan)

4. **Set Environment Variables**
   In the Environment section, add these variables (get values from `backend/production.env.example`):
   
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI2=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-secret-key-different-from-jwt-secret
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=https://your-app-name.netlify.app
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=jpg,jpeg,png,gif
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your Render URL (e.g., `https://your-app-name.onrender.com`)

### Step 3: Update CORS Configuration

After getting your Netlify URL (in the next section), update the backend CORS configuration:

1. Edit `backend/server.js`
2. Replace `"https://your-app-name.netlify.app"` with your actual Netlify URL
3. Commit and push changes (Render will auto-deploy)

## 🎨 Frontend Deployment on Netlify

### Step 1: Update Configuration Files

1. **Update netlify.toml**
   - Edit `FrontEnd/netlify.toml`
   - Replace `https://your-backend-app-name.onrender.com` with your actual Render URL

### Step 2: Deploy to Netlify

1. **Login to Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com) and sign in

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize access
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `FrontEnd`
   - **Build command**: `npm run build`
   - **Publish directory**: `FrontEnd/build`

4. **Set Environment Variables**
   In Site settings → Environment variables, add:
   ```
   REACT_APP_API_URL=https://your-backend-app-name.onrender.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note your Netlify URL (e.g., `https://amazing-app-123456.netlify.app`)

### Step 3: Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain if you have one
3. Update environment variables in both Netlify and Render accordingly

## 🔄 Post-Deployment Updates

### Update Backend CORS

1. Edit `backend/server.js`:
   ```javascript
   const allowedOrigins = [
       process.env.FRONTEND_URL || "http://localhost:3000",
       "http://localhost:3000",
       "http://127.0.0.1:3000",
       "https://your-actual-netlify-url.netlify.app" // Replace with actual URL
   ];
   ```

2. Update Render environment variable:
   ```
   FRONTEND_URL=https://your-actual-netlify-url.netlify.app
   ```

## 🧪 Testing Your Deployment

### Health Check

1. **Backend Health Check**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return JSON with server status

2. **API Documentation**
   - Visit: `https://your-backend-url.onrender.com/api`
   - Should return API documentation

3. **Frontend**
   - Visit your Netlify URL
   - Test user registration/login
   - Verify API calls are working

### Common Issues & Solutions

1. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly in Render
   - Verify the Netlify URL is added to allowedOrigins in server.js

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check database user permissions
   - Ensure IP whitelist includes 0.0.0.0/0 (or specific IPs)

3. **Build Failures**
   - Check build logs in respective platforms
   - Verify all environment variables are set
   - Ensure package.json scripts are correct

## 📱 Environment URLs

After deployment, you'll have:

- **Production Frontend**: `https://your-app-name.netlify.app`
- **Production Backend**: `https://your-backend-name.onrender.com`
- **Backend API Docs**: `https://your-backend-name.onrender.com/api`
- **Health Check**: `https://your-backend-name.onrender.com/api/health`

## 🔐 Security Checklist

- [ ] Use strong, unique JWT secrets in production
- [ ] Enable MongoDB Atlas security features
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS (handled by both platforms)
- [ ] Set up proper rate limiting
- [ ] Monitor application logs

## 🚨 Important Notes

1. **Free Tier Limitations**:
   - Render free tier: 750 hours/month, sleeps after 15 min inactivity
   - Netlify free tier: 100GB bandwidth, 300 build minutes/month

2. **Database**:
   - Use MongoDB Atlas for production database
   - Free tier provides 512MB storage

3. **Files/Uploads**:
   - Consider using cloud storage (AWS S3, Cloudinary) for file uploads
   - Current setup stores uploads locally (will be lost on Render restarts)

## 📞 Need Help?

Check the deployment logs in both platforms for detailed error messages. Both Netlify and Render provide excellent logging for troubleshooting.

Happy deploying! 🎉 