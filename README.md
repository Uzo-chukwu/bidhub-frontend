# BidHub - Online Auction Marketplace

A production-grade frontend for an online auction marketplace built with Next.js, TypeScript, Tailwind CSS, and React Query.

## 🚀 Features

### Public Features
- **Landing Page**: Hero section with search functionality
- **Auction Listings**: Browse auctions with pagination and search
- **Auction Details**: View auction information, place bids, see bid history
- **Real-time Updates**: 5-second polling for live auction updates

### User Features
- **Authentication**: Login and registration with JWT
- **Profile Management**: View user profile and account details
- **Create Auctions**: List items for bidding with validation
- **Edit Auctions**: Modify pending auctions
- **My Listings**: Manage all personal auctions
- **Delete Auctions**: Remove pending auctions with no bids

### Admin Features
- **Admin Dashboard**: Overview statistics and metrics
- **Pending Review**: Approve or reject new auctions
- **All Auctions Management**: Filter by status
- **Rejection Reasons**: Provide feedback for rejected auctions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── auctions/
│   │   ├── [id]/
│   │   │   ├── page.tsx     # Auction details
│   │   │   └── edit/
│   │   │       └── page.tsx # Edit auction
│   │   └── create/
│   │       └── page.tsx     # Create auction
│   ├── admin/
│   │   └── page.tsx         # Admin dashboard
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   ├── my-listings/
│   │   └── page.tsx         # User's auctions
│   ├── profile/
│   │   └── page.tsx         # User profile
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable UI components
│   ├── AuctionCard.tsx
│   ├── StatusBadge.tsx
│   ├── PageHeader.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSkeleton.tsx
│   ├── FormField.tsx
│   ├── AuthGuard.tsx
│   ├── AdminGuard.tsx
│   ├── CountdownTimer.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── features/                # Feature-specific components
├── hooks/                   # Custom React hooks
│   ├── useApi.ts           # React Query hooks for all API operations
│   └── useCountdown.ts     # Countdown timer hook
├── services/                # API service layer
│   ├── auth.service.ts
│   ├── auction.service.ts
│   ├── bid.service.ts
│   ├── admin.service.ts
│   └── index.ts
├── lib/                     # Utilities and configuration
│   ├── api-client.ts       # Axios instance with interceptors
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript type definitions
│   └── index.ts
└── providers/               # React context providers
    ├── ReactQueryProvider.tsx
    └── ToastProvider.tsx
```

## 🎯 Key Features

### Authentication
- JWT token stored in localStorage
- Axios interceptor attaches token to requests
- Automatic redirect on 401 (unauthorized)
- Auth guard for protected routes
- Admin guard for admin-only routes

### API Integration
- Centralized API client with interceptors
- Typed request/response using TypeScript
- Error handling at global and form level
- React Query for data fetching and caching
- 5-second polling for auction updates

### UI/UX
- Premium modern design
- Responsive layout (mobile-first)
- Clean spacing and typography
- Status badges with color coding
- Smooth hover effects and transitions
- Loading skeletons for all pages
- Empty states with clear CTAs
- Error states with retry functionality
- Toast notifications for user feedback

### Form Handling
- React Hook Form for form state
- Zod validation schemas
- Real-time validation feedback
- Loading states during submission
- Error messages for failed submissions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bidhub-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# .env.local (already configured)
NEXT_PUBLIC_API_URL=https://bidhub-backend.onrender.com
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (600-700)
- **Secondary**: Purple (600-700)
- **Success**: Green (600-800)
- **Warning**: Yellow (600-800)
- **Error**: Red (600-800)
- **Neutral**: Gray (50-900)

### Status Colors
- **PENDING**: Yellow badge
- **APPROVED**: Green badge
- **REJECTED**: Red badge
- **CLOSED**: Gray badge

### Typography
- **Font**: Geist Sans (Google Fonts)
- **Heading**: Bold, large sizes
- **Body**: Regular weight, readable sizes

## 🔐 Routes

### Public Routes
- `/` - Home (auction listings)
- `/login` - Login
- `/register` - Registration
- `/auctions/[id]` - Auction details

### Protected Routes (Requires Auth)
- `/profile` - User profile
- `/my-listings` - User's auctions
- `/auctions/create` - Create auction
- `/auctions/[id]/edit` - Edit auction (owner only, pending status)

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## ⚡ Performance Features

- **Static Generation**: Pages pre-rendered at build time
- **Client-side Navigation**: Fast page transitions
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: React Query cache for API responses
- **Polling**: 5-second interval for live updates

## 🛡️ Security Features

- JWT authentication
- Protected API routes
- HTTP-only token storage (can be upgraded)
- CSRF protection ready
- XSS prevention measures
- Input validation with Zod

## 📊 State Management

### React Query
- Server state management
- Automatic caching
- Background refetching
- Optimistic updates
- Invalidation strategies

### Local State
- React useState for UI state
- Context for toast notifications
- Form state with React Hook Form

## 🔄 API Integration

### Services
- `authService` - Login, register, logout, profile
- `auctionService` - CRUD operations for auctions
- `bidService` - Place and retrieve bids
- `adminService` - Approve/reject auctions

### Error Handling
- Global 401 interceptor → logout
- Form-level error display
- Toast notifications for errors
- Retry functionality for failed requests

## 📝 Validation Schemas

All forms use Zod schemas for validation:
- Login schema
- Register schema
- Create/Edit auction schema
- Bid schema

## 🎭 Edge Cases Handled

- Empty states for all data views
- Expired auctions
- Invalid auction access
- 401 → automatic logout
- 403 → permission denied UI
- 404 → not found page
- Loading states for all async operations
- Failed API requests with retry

## 🌟 UI Components

### Reusable Components
- `AuctionCard` - Auction preview with hover effects
- `StatusBadge` - Color-coded status indicators
- `PageHeader` - Consistent page headers
- `EmptyState` - Empty data views
- `LoadingSkeleton` - Loading placeholders
- `FormField` - Form inputs with validation
- `AuthGuard` - Protected route wrapper
- `AdminGuard` - Admin route wrapper
- `CountdownTimer` - Live countdown display

## 📈 Future Enhancements

- WebSocket for real-time bid updates
- Image upload integration
- Email notifications
- Advanced search filters
- User ratings and reviews
- Auction categories
- Featured auctions
- Dark mode support
- Internationalization (i18n)
- Analytics dashboard

## 🤝 Contributing

This is a production-ready codebase. For modifications:
1. Follow the existing code structure
2. Use TypeScript strictly
3. Add proper error handling
4. Test all edge cases
5. Maintain consistent styling

## 📄 License

MIT License - feel free to use this codebase for your projects.

## 👨‍💻 Developer Notes

- All prices are handled as strings (from backend API)
- Timestamps are ISO 8601 format (UTC)
- No refresh tokens (re-login on expiry)
- Images use external URLs (no upload endpoint)
- Pagination returns `{ data, total }` structure

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
