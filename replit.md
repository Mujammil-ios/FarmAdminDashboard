# Farm Booking Management System

## Overview

This is a full-stack farm booking management system built with React (client) and Express.js (server). The application serves as an admin dashboard for managing farm bookings, users, transactions, and farm-related data. It uses TypeScript for type safety, Drizzle ORM for database interactions with PostgreSQL, and shadcn/ui for modern UI components.

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
- **User Management**: CRUD operations for users and owners
- **Farm Management**: Farm listings, approval workflows
- **Booking System**: Slot management with morning/evening schedules
- **Financial Tracking**: Transaction monitoring and revenue analytics
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
- June 24, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```