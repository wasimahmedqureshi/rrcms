# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rrcms.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `rrcms` repository
5. Configure environment variables:
   - `DATABASE_URL` = `file:./db.sqlite`
6. Click "Deploy"

### Step 3: Access Your Application
- Vercel will provide a URL like: `https://rrcms.vercel.app`

---

## Deploy to Render

### Step 1: Create Account
1. Go to [render.com](https://render.com)
2. Sign up and connect your GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: rrcms
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
- `DATABASE_URL` = `file:./data/db.sqlite`

### Step 4: Deploy
Click "Create Web Service"

---

## Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize
```bash
railway login
railway init
```

### Step 3: Add PostgreSQL (Optional)
```bash
railway add --plugin postgresql
```

### Step 4: Deploy
```bash
railway up
```

---

## Self-Hosted (VPS/Dedicated Server)

### Prerequisites
- Node.js 18+
- npm or bun
- PM2 (for process management)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/rrms.git
cd rrcms

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit your configuration

# Setup database
npx prisma generate
npx prisma db push

# Build application
npm run build

# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "rrcms" -- start

# Save PM2 config
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./data/db.sqlite
    volumes:
      - ./data:/app/data
```

### Run with Docker

```bash
docker-compose up -d
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite or PostgreSQL connection string |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | No | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | No | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | No | Firebase project ID |
| `NEXT_PUBLIC_APP_URL` | No | Public URL of your application |

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Database connection works
- [ ] User can login
- [ ] Cases can be added/edited
- [ ] Reports generate correctly
- [ ] Excel import/export works
- [ ] Mobile responsive design
- [ ] Dark mode toggle works

---

## Troubleshooting

### Database Issues
```bash
# Reset database
npx prisma migrate reset

# Check database
npx prisma studio
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Runtime Errors
```bash
# Check logs
npm run dev
# or
pm2 logs rrcms
```

---

## Support

For issues, please create a GitHub issue or contact the development team.
