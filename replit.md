# Farm Booking Management System

## Overview

This is a comprehensive full-stack farm booking management system built with React (client) and Express.js (server). The application serves as an advanced admin dashboard for managing farm bookings, users, transactions, and farm-related data with Firebase Auth integration. It features a sophisticated user management system with role-based access control, detailed customer/owner tracking, payment management, and revenue analytics. The system uses TypeScript for type safety, in-memory data structures for user management, and shadcn/ui for modern UI components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful APIs with proper error handling
- **Build Process**: ESBuild for server bundling

## Key Components

### Database Schema
The system manages several core entities:
- **Users**: Customer and farm owner accounts with role-based access
- **Farms**: Farm listings with details, pricing, and location data
- **Bookings**: Reservation system with slot-based scheduling
- **Categories & Amenities**: Classification and feature systems
- **Transactions**: Payment and revenue tracking
- **Reviews**: Customer feedback system
- **Administrative**: FAQ management and admin accounts

### Admin Dashboard Features
- **Dashboard Metrics**: Real-time KPIs and analytics
- **Advanced User Management**: Firebase Auth integration with comprehensive customer/owner profiles
- **Role-Based Access Control**: Admin roles with granular permissions (Super Admin, Customer Support, Finance)
- **Customer Management**: Detailed tracking including bookings, payments, loyalty points, preferences
- **Owner Management**: Business details, bank information, earnings, payouts, KYC status
- **Farm Management**: Farm listings, approval workflows
- **Booking System**: Slot management with morning/evening schedules
- **Payment Management**: Transaction tracking, commission handling, payout processing
- **Financial Tracking**: Revenue reports, commission analytics, outstanding payments
- **Support System**: Ticket management with role-based assignment
- **Content Management**: Categories, amenities, cities, and FAQs

### Slot Management System
The application implements a sophisticated slot booking system:
- **Time Slots**: Morning (6:00-18:00) and Evening (18:00-6:00) slots
- **Cleaning Buffer**: 1-hour cleaning time between bookings
- **Pricing**: Per-slot pricing with dynamic calculations
- **Availability**: Calendar-based availability tracking

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and business logic
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Handling**: JSON responses with proper error states
5. **UI Updates**: React Query automatically updates the UI with fresh data

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit
- **Connection Pooling**: Built-in connection management

### UI & Styling
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundler for server
- **PostCSS**: CSS processing

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Environment-based connection via DATABASE_URL
- **Port Configuration**: Development server on port 5000

### Production Build
- **Client Build**: Vite builds optimized static assets
- **Server Build**: ESBuild bundles server code with external packages
- **Static Serving**: Express serves built client assets
- **Environment**: Production mode with optimizations

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Development**: `npm run dev` with automatic reloading

## Changelog
```
Changelog:
- July 12, 2025. Implemented simplified Coupon & Refund Management system
  * Successfully simplified coupon management with standard features as requested
  * Added simple coupon creation, status management, and basic analytics
  * Implemented refund processing with approve/reject workflow
  * Created booking calculator with real-time coupon validation and tax calculation
  * Simplified wallet display to user-based single-line format
  * Added comprehensive API documentation covering all endpoints
  * Fixed analytics API routes and removed complex UI features
  * Updated system to be simple and functional without "top notch" complexity
- July 12, 2025. Implemented comprehensive Super Admin console with Rewards & Wallet system
  * Successfully migrated from Replit Agent to standard Replit environment
  * Added comprehensive Rewards & Wallet management system with user wallets, campaigns, and configuration
  * Implemented integrated API Documentation workspace with markdown editing and preview
  * Created detailed Audit Trail system for tracking all administrative actions
  * Enhanced sidebar navigation with Rewards & Wallet and Documentation sections
  * Added rewards campaigns management with performance tracking and analytics
  * Integrated wallet transaction tracking and manual balance adjustments
  * Created comprehensive admin interface following modern UX/UI patterns
- June 27, 2025. Migrated project to standard Replit environment and implemented comprehensive Farm Performance analytics
  * Successfully migrated from Replit Agent to standard Replit environment
  * Implemented comprehensive Farm Performance dashboard with global metrics and individual farm analytics
  * Added interactive calendar views with booking status indicators
  * Created detailed farm-wise performance tracking with monthly metrics
  * Enhanced data services with realistic, comprehensive sample data across all features
  * Added booking history, transaction tracking, reviews, and owner payout management
  * Integrated advanced charting with trend analysis and top performer rankings
  * Enhanced sidebar navigation with Farm Performance section
- June 27, 2025. Implemented comprehensive user management system with Firebase Auth integration
  * Added advanced customer and owner profile management
  * Implemented role-based access control with granular permissions
  * Created payment tracking and payout management system
  * Added support ticket management and revenue analytics
  * Enhanced sidebar with collapsible grouped navigation
  * Redesigned availability checker with detailed farm cards and slot-wise pricing
- June 24, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```