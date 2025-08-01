# maddevs-og 🚀

A modern web design and development studio website built with **Next.js 15**, **Express.js**, and **MongoDB**. Features advanced animations, comprehensive SEO optimization, and a robust backend API for content management.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-4.18.2-green?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.1-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

## ✨ Features

### 🎨 **Frontend**
- **Next.js 15** with App Router for optimal performance
- **Advanced Animations** using GSAP and Three.js
- **Responsive Design** with Tailwind CSS
- **TypeScript** for type safety
- **Smooth Scrolling** with Lenis
- **Custom Cursor** and interactive elements

### 🔧 **Backend**
- **Express.js** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for admin access
- **Email System** with Nodemailer
- **Content Management** for blogs and news
- **Onboard Management** system

### 🔍 **SEO & Performance**
- **Server-Side Rendering** (SSR)
- **Static Site Generation** (SSG)
- **Dynamic Metadata** generation
- **Structured Data** (JSON-LD)
- **XML Sitemaps** with automatic generation
- **Robots.txt** configuration
- **Open Graph** and Twitter Cards

### 🚀 **Deployment**
- **AWS EC2** for backend hosting
- **AWS S3** for static assets
- **PM2** process management
- **Nginx** reverse proxy
- **CloudFront** CDN
- **MongoDB Atlas** database

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 4000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   PM2           │    │   AWS S3        │
│   (Reverse      │    │   (Process      │    │   (Static       │
│   Proxy)        │    │   Manager)      │    │   Assets)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** 6+
- **Git**
- **AWS CLI** (for deployment)

### 1. Clone Repository
```bash
git clone <repository-url>
cd maddevs-og
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

### 4. Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/maddevs-og
JWT_SECRET=your-super-secret-jwt-key
API_SECRET_KEY=your-api-secret-key
MAIL_SMTP_HOST=smtp.gmail.com
MAIL_SMTP_PORT=587
MAIL_SMTP_USER=your-email@gmail.com
MAIL_SMTP_PASS=your-email-password
NODE_ENV=development
PORT=4000
```

## 📁 Project Structure

```
maddevs-og/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── api/                      # API routes (proxies)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── pam/                     # Blog & News pages
│   │   ├── blogs/
│   │   └── news/
│   ├── products/                # Products page
│   ├── services/                # Services page
│   ├── works/                   # Works page
│   ├── onboard/                 # Onboard page
│   └── sitemap.ts              # Dynamic sitemap
├── components/                   # React components
│   ├── segments/                # Home page segments
│   ├── Cursor.tsx              # Custom cursor
│   ├── Footer.tsx              # Footer component
│   ├── NavBar.tsx              # Navigation
│   └── LenisSmoothScroll.tsx   # Smooth scrolling
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── public/                      # Static assets
│   ├── assets/                  # Images, fonts, media
│   ├── robots.txt              # Robots configuration
│   └── sitemap.xml             # Static sitemap
├── server/                      # Express.js backend
│   ├── middleware/              # Custom middleware
│   ├── index.js                # Main server file
│   ├── config.js               # Configuration
│   ├── mailService.js          # Email service
│   ├── mailTemplates.js        # Email templates
│   ├── ecosystem.config.js     # PM2 configuration
│   └── nginx.conf              # Nginx configuration
├── scripts/                     # Deployment scripts
│   ├── deploy-backend.sh       # Backend deployment
│   ├── deploy-frontend.sh      # Frontend deployment
│   └── setup-env.sh            # Environment setup
├── package.json                 # Frontend dependencies
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🛠️ Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run export       # Export static site
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
```

## 📚 API Endpoints

### Public Endpoints
```http
GET    /api/blogs                 # Get all blogs
GET    /api/blogs/slug/:slug      # Get blog by slug
GET    /api/news                  # Get all news
GET    /api/news/slug/:slug       # Get news by slug
POST   /api/onboard               # Submit onboard request
```

### Admin Endpoints (JWT Required)
```http
POST   /api/admin/blogs           # Create blog
PATCH  /api/admin/blogs/:id       # Update blog
DELETE /api/admin/blogs/:id       # Delete blog
POST   /api/admin/news            # Create news
PATCH  /api/admin/news/:id        # Update news
DELETE /api/admin/news/:id        # Delete news
GET    /api/onboard/all           # Get all onboard requests
PATCH  /api/onboard/:id/approve   # Approve onboard request
PATCH  /api/onboard/:id/done      # Mark onboard as done
```

### Authentication
```http
POST   /api/login                 # Admin login
POST   /api/logout                # Admin logout
GET    /api/validate-token        # Validate JWT token
GET    /api/session/status        # Check session status
```

## 🚀 Deployment

### Backend Deployment (EC2)
```bash
# Run deployment script
./scripts/deploy-backend.sh

# Or manually:
cd server
zip -r ../backend.zip . -x "node_modules/*" ".env*"
aws s3 cp ../backend.zip s3://maddevs-backend-bucket/
```

### Frontend Deployment (S3)
```bash
# Run deployment script
./scripts/deploy-frontend.sh

# Or manually:
npm run build
aws s3 sync out/ s3://maddevs-frontend-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### PM2 Process Management
```bash
# Start backend with PM2
cd server
pm2 start ecosystem.config.js

# Monitor processes
pm2 status
pm2 logs maddevs-backend

# Restart processes
pm2 restart all
```

## 🔧 Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'maddevs-backend',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};
```

## 🔍 SEO Features

### Dynamic Metadata
```typescript
export async function generateMetadata({ params }) {
  const blog = await fetchBlog(params.slug);
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [{ url: blog.imageUrl }]
    }
  };
}
```

### Structured Data (JSON-LD)
```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: blog.title,
  author: { '@type': 'Person', name: blog.author },
  publisher: { '@type': 'Organization', name: 'maddevs' }
};
```

### Dynamic Sitemap
```typescript
export default async function sitemap() {
  const blogs = await fetch('http://localhost:4000/api/blogs');
  const news = await fetch('http://localhost:4000/api/news');
  
  return [
    { url: 'https://maddevs.in', lastModified: new Date() },
    ...blogs.map(blog => ({
      url: `https://maddevs.in/pam/blogs/${blog.slug}`,
      lastModified: new Date(blog.date)
    }))
  ];
}
```

## 🎨 Animation Features

### GSAP Animations
```typescript
useLayoutEffect(() => {
  gsap.timeline()
    .to(element, { duration: 2, text: 'onboard', ease: 'none' })
    .to(content, { duration: 1.2, xPercent: 0, autoAlpha: 1 });
}, []);
```

### Three.js Integration
```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <OrbitControls />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### MongoDB Connection
```bash
# Check MongoDB status
sudo systemctl status mongod
sudo systemctl restart mongod
```

#### PM2 Issues
```bash
# Check PM2 status
pm2 status
pm2 logs maddevs-backend
pm2 restart all
```

#### Nginx Issues
```bash
# Test configuration
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Performance

### Frontend Optimizations
- **Static Site Generation** (SSG) for better performance
- **Image Optimization** with Next.js Image component
- **Code Splitting** and lazy loading
- **Bundle Analysis** and optimization

### Backend Optimizations
- **Database Indexing** for faster queries
- **Caching** strategies
- **Rate Limiting** for API protection
- **Compression** middleware

## 🔒 Security

- **JWT Authentication** for admin access
- **API Key Validation** for external requests
- **CORS Configuration** for cross-origin requests
- **Input Sanitization** for user content
- **HTTPS** enforcement in production

## 📈 Monitoring

- **PM2 Monitoring** for process management
- **AWS CloudWatch** for server metrics
- **MongoDB Atlas** monitoring
- **Google Analytics** for frontend analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed by maddevs. All rights reserved.

## 👥 Team

- **Development**: maddevs Development Team
- **Design**: maddevs Design Team
- **DevOps**: maddevs Infrastructure Team

## 📞 Support

For support and questions:
- **Email**: contact@maddevs.in
- **Website**: https://maddevs.in
- **Documentation**: See `PROJECT_DOCUMENTATION.md` for detailed documentation

---

<div align="center">

**Built with ❤️ by [maddevs](https://maddevs.in)**

[![maddevs](https://img.shields.io/badge/maddevs-Web%20Studio-FF6B6B?style=for-the-badge&logo=heart)](https://maddevs.in)

</div>
