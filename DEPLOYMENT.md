# BidHub Deployment Guide

## Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Deploy on Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure environment variables:
  - `NEXT_PUBLIC_API_URL=https://bidhub-backend.onrender.com`
- Click "Deploy"

### Custom Domain
- Go to your Vercel project settings
- Navigate to "Domains"
- Add your custom domain
- Update DNS records as instructed

## Deploy to Netlify

### Steps

1. Build the project
```bash
npm run build
```

2. Deploy on Netlify
- Go to [netlify.com](https://netlify.com)
- Drag and drop the `.next` folder or connect to GitHub
- Configure environment variables
- Deploy

## Deploy to AWS/Azure/GCP

### Docker Deployment

1. Create a Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

2. Build and run
```bash
docker build -t bidhub-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://bidhub-backend.onrender.com bidhub-frontend
```

## Environment Variables

All deployments require:
```
NEXT_PUBLIC_API_URL=https://bidhub-backend.onrender.com
```

## Post-Deployment Checklist

- [ ] Verify all routes work correctly
- [ ] Test authentication flow
- [ ] Check API integration
- [ ] Verify image loading
- [ ] Test responsive design
- [ ] Check form validations
- [ ] Test admin functionality
- [ ] Verify real-time updates

## Performance Optimization

- Enable Vercel's Edge Network (automatic)
- Configure caching headers
- Use CDN for static assets
- Enable compression
- Monitor Core Web Vitals

## Monitoring

Consider adding:
- Vercel Analytics
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics

---

**For production use, ensure you have proper SSL certificates and security headers configured.**
