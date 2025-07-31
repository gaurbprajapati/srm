# 🚀 Deployment Checklist

## Pre-Deployment Setup

### Database Setup
- [ ] Create MongoDB Atlas account
- [ ] Create new cluster
- [ ] Create database user
- [ ] Get connection string
- [ ] Whitelist IPs (0.0.0.0/0 for full access)

### Repository Setup
- [ ] Code is pushed to GitHub
- [ ] Repository is public or connected to services

## Backend Deployment (Render)

### Configuration
- [ ] Fixed `package.json` main field ✅
- [ ] Updated port configuration ✅
- [ ] Created `render.yaml` ✅
- [ ] Created `production.env.example` ✅

### Render Setup
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set root directory to `backend`
- [ ] Configure build settings:
  - Build Command: `npm install`
  - Start Command: `npm start`

### Environment Variables
- [ ] NODE_ENV=production
- [ ] PORT=10000
- [ ] MONGO_URI2=[your-mongodb-connection-string]
- [ ] JWT_SECRET=[strong-secret-key]
- [ ] JWT_REFRESH_SECRET=[different-secret-key]
- [ ] FRONTEND_URL=[your-netlify-url]
- [ ] Other variables from `production.env.example`

### Deployment
- [ ] Deploy service
- [ ] Verify deployment successful
- [ ] Test health endpoint: `/api/health`
- [ ] Note backend URL for frontend config

## Frontend Deployment (Netlify)

### Configuration
- [ ] Created `netlify.toml` ✅
- [ ] Created `_redirects` ✅
- [ ] API URL configuration ready

### Netlify Setup
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Create new site
- [ ] Set base directory to `FrontEnd`
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Publish Directory: `FrontEnd/build`

### Environment Variables
- [ ] REACT_APP_API_URL=[your-render-backend-url]

### Deployment
- [ ] Deploy site
- [ ] Verify deployment successful
- [ ] Test frontend functionality
- [ ] Note frontend URL for backend CORS

## Post-Deployment Updates

### Backend CORS Update
- [ ] Update `backend/server.js` with actual Netlify URL
- [ ] Update `FRONTEND_URL` in Render environment variables
- [ ] Redeploy backend

### Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test API endpoints
- [ ] Test file uploads (if applicable)
- [ ] Test all major app features

## URLs to Remember

- **Backend URL**: `https://______.onrender.com`
- **Frontend URL**: `https://______.netlify.app`
- **API Docs**: `https://______.onrender.com/api`
- **Health Check**: `https://______.onrender.com/api/health`

## Troubleshooting

### Common Issues
- [ ] CORS errors → Check FRONTEND_URL and allowedOrigins
- [ ] Database connection → Verify MongoDB Atlas connection string
- [ ] Build failures → Check logs and environment variables
- [ ] 404 errors → Verify `_redirects` file for frontend routing

### Logs to Check
- [ ] Render deployment logs
- [ ] Render runtime logs
- [ ] Netlify build logs
- [ ] Browser console for frontend errors

---

**Status**: ⏳ Ready for deployment
**Next Step**: Follow the detailed [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 