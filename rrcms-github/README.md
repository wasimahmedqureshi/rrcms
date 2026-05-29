# RRCMS - Rajasthan Revenue Court Management System

A comprehensive web application for managing revenue court cases in Rajasthan Government.

![RRCMS Dashboard](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time statistics with section-wise and year-wise case counts
- **Pending Cases** - Full CRUD operations with search, filter, and aging calculations
- **Disposed Cases** - Track disposed cases with disposal details
- **Case Registration** - Complete form with all required fields
- **Office Management** - Add/Edit/Delete revenue offices
- **Section Management** - Manage case categories/sections

### Reports
- **Pending MPR** - Monthly Progress Report with 10 aging categories
- **Disposal MPR** - Disposal analysis report
- **Section-wise Reports** - Cases grouped by section
- **Year-wise Reports** - Cases grouped by institution year

### Additional Features
- 🔐 Role-based authentication (Super Admin, Office Admin, Data Entry)
- 📊 Real-time dashboard statistics
- 🔍 Advanced search and filtering
- 📱 Mobile responsive design
- 🌓 Dark/Light mode toggle
- 📁 Excel import/export functionality
- 🔔 Notification system

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Prisma ORM | Latest |
| SQLite | Latest |
| shadcn/ui | New York Style |
| Recharts | Latest |
| Zustand | Latest |

## 📦 Project Structure

```
rrcms/
├── prisma/
│   └── schema.prisma        # Database models
├── public/
│   └── manifest.json        # PWA manifest
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication
│   │   │   ├── cases/       # Case management
│   │   │   ├── offices/     # Office management
│   │   │   ├── sections/    # Section management
│   │   │   ├── reports/     # Reports API
│   │   │   ├── import/      # Excel import
│   │   │   └── export/      # Excel export
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main application
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── db.ts            # Database client
│   │   ├── firebase.ts      # Firebase config
│   │   └── utils.ts         # Utility functions
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript definitions
├── .env.example             # Environment variables
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/rrcms)

1. Fork this repository
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy!

### Option 2: Deploy to GitHub Pages

Since this is a Next.js application with server-side features, GitHub Pages only supports static exports. For full functionality, use Vercel or another Node.js hosting platform.

### Option 3: Self-Hosted Deployment

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rrcms.git
cd rrcms

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma db push

# Build for production
npm run build

# Start the server
npm start
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./db.sqlite"

# Firebase (Optional - for real-time sync)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Run linting
npm run lint
```

## 📊 Database Schema

### Core Tables
- **User** - User accounts and authentication
- **Office** - Revenue offices
- **Section** - Case categories
- **PendingCase** - Active cases
- **DisposedCase** - Closed cases
- **AuditLog** - System activity tracking
- **Notification** - User alerts
- **ImportHistory** - Bulk import tracking

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| Super Admin | Full system access, user management |
| Office Admin | Manage cases for assigned office |
| Data Entry | Add and edit cases |

## 📱 PWA Support

The application supports Progressive Web App features:
- Install on mobile devices
- Offline capability
- Push notifications (when configured)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Recharts](https://recharts.org/) - Charting library

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ for Rajasthan Government
