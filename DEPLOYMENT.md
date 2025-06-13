# Dharamshala - Simple Deployment Guide

## Quick Deploy to Vercel (Frontend Only - Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
vercel --prod
```

That's it! Your frontend will be deployed to Vercel.

## Deploy Backend Separately

### Option 1: Railway (Recommended for Backend)

1. Go to https://railway.app
2. Connect your GitHub repo
3. Select the `backend` folder
4. Add environment variables:
   - `MONGODB_URI` → Your MongoDB Atlas connection string
   - `JWT_SECRET` → Any secure random string
   - `NODE_ENV` → production

### Option 2: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables

## Update Frontend for Production

After deploying your backend, update the frontend's API URL:

1. Create `frontend/.env.production`:

```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

2. Redeploy frontend:

```bash
vercel --prod
```

## All Done! 🎉

Your Dharamshala app is now live!
