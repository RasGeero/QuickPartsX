# Overview

QuickParts is a marketplace web application for auto parts in Ghana, connecting car parts sellers with buyers. The platform allows users to browse and search for auto parts, sellers to list their inventory, and includes an admin panel for platform management. The application features user authentication via Replit Auth, comprehensive seller profiles with ratings, and advanced filtering capabilities for parts discovery.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication
- **Form Handling**: React Hook Form with Zod validation schemas
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Uploads**: Multer middleware for handling multipart form data and image uploads
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **API Design**: RESTful API with dedicated routes for authentication, parts, ratings, and admin operations

## Database Design
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Key Entities**:
  - Users table with seller profiles, verification status, and admin roles
  - Parts table with detailed product information, images, and seller relationships
  - Ratings table for seller feedback system
  - Sessions table for authentication state persistence

## Authentication & Authorization
- **Provider**: Replit OIDC authentication with Passport.js strategy
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Role-based access control with admin and seller privileges
- **Security**: HTTP-only cookies, CSRF protection, and secure session management

## File Management
- **Upload Strategy**: Local file storage with Multer processing
- **Image Handling**: Multiple image uploads per part listing with size and type validation
- **Static Serving**: Express static middleware for uploaded images
- **Validation**: File type restrictions to images only with size limits

## API Structure
- **Authentication Routes**: User login, logout, profile management
- **Parts Management**: CRUD operations with advanced filtering and search
- **Seller Operations**: Profile management, parts listing, verification system
- **Rating System**: Seller feedback and average rating calculations
- **Admin Panel**: User management, platform oversight, content moderation

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **express**: Web application framework for the backend API
- **react**: Frontend UI library with TypeScript support
- **@tanstack/react-query**: Server state management and caching

## Authentication & Session Management
- **passport**: Authentication middleware with OpenID Connect strategy
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store adapter
- **openid-client**: OIDC authentication client for Replit Auth

## UI & Styling
- **@radix-ui/***: Unstyled, accessible UI primitives for complex components
- **tailwindcss**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library based on Radix UI
- **lucide-react**: Icon library for consistent iconography

## Form & Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration layer for external validation libraries
- **zod**: TypeScript-first schema validation library

## Development & Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking for JavaScript
- **tsx**: TypeScript execution engine for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

## File Upload & Processing
- **multer**: Middleware for handling multipart/form-data file uploads
- **@types/multer**: TypeScript definitions for Multer

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **class-variance-authority**: Utility for creating variant-based component APIs