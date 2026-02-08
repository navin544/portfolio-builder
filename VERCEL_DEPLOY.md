# Vercel Deployment Guide

## Setup Steps

### 1. **Add Database (PostgreSQL)**
Choose one of these services:
- **Vercel Postgres** (integrated): https://vercel.com/docs/storage/vercel-postgres
- **Neon**: https://neon.tech (free tier available)
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com

Get your `DATABASE_URL` connection string.

### 2. **Set Environment Variables in Vercel**
Go to **Project Settings → Environment Variables** and add:
```
DATABASE_URL = postgresql://user:password@host:5432/dbname
NODE_ENV = production
```

### 3. **Deploy via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect GitHub repo directly in Vercel dashboard.

### 4. **Initialize Database Schema**
After first deployment, run:
```bash
vercel env pull      # Pull env vars locally
npm run db:push      # Push schema to PostgreSQL
```

## Project Structure
- `vercel.json` — Deployment configuration
- `package.json` — Node version (>=20.0.0), build scripts
- `server/index.ts` — Express server on port 5000
- `dist/` — Built output (auto-generated)
- `client/public/` — Static files (resume, images)

## Build & Start
- Build: `npm run build`
- Start: `npm start`
- Dev: `npm run dev`

## Troubleshooting
- **Build fails**: Check `npm run build` runs locally first
- **Database error**: Verify `DATABASE_URL` is set in Vercel dashboard
- **Static files 404**: Check `client/public/resume.pdf` is deployed
