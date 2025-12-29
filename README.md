# School of Presence - Portfolio Website

A high-performance portfolio website for Sarpong Andrews Boakye, a communication coach and entrepreneur. Built with Next.js 14 and Supabase.

## Overview

School of Presence is a communication coaching brand designed to help executives, entrepreneurs, leaders, and communication enthusiasts master the art of speaking with impact.

## Features

### Website Features
- Animated preloader with branding
- Hero section with portrait and call-to-action
- About section with personal brand story
- Services section (dynamically loaded from database)
- Coaching focus areas and outcomes
- Other ventures showcase (Trekenvyl Footwear)
- Booking system with payment integration
- Course purchase and access
- User dashboard with progress tracking

### Design Features
- Executive dark mode with navy blue palette
- Glassmorphism effects on navigation and cards
- Smooth scroll animations with Framer Motion
- Responsive mobile-first design
- Premium typography (Plus Jakarta Sans, Outfit)

## Tech Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + Shadcn UI
- Animation: Framer Motion
- Database: Supabase (PostgreSQL)
- Payments: Paystack
- Scheduling: Cal.com
- Email: Resend
- Language: TypeScript

## Prerequisites

1. Node.js v18 or higher
2. npm or yarn
3. Supabase Account (https://supabase.com)
4. Paystack Account (https://paystack.com)
5. Cal.com Account (https://cal.com)
6. Resend Account (https://resend.com)

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
RESEND_API_KEY=your_resend_api_key
ADMIN_NOTIFICATION_EMAIL=your_admin_email
```

### Step 3: Database Setup

The database should already be configured in Supabase with the following tables:
- profiles: User profiles
- services: Communication services offered
- courses: Online courses
- purchases: Course purchase records
- course_progress: Learning progress tracking
- waitlist: Course waitlist signups
- bookings: Service booking requests

### Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
app/
  booking/          - Service booking page
  courses/          - Course listing and purchase
  dashboard/        - User dashboard (protected)
  login/            - Authentication page
  api/              - API routes (bookings, payments)
  globals.css       - Global styles and theme
  layout.tsx        - Root layout with preloader
  page.tsx          - Landing page

components/
  ui/               - Shadcn UI components
  BookingForm.tsx   - Booking form with payment
  BuyButton.tsx     - Course purchase button
  CourseCard.tsx    - Course display card
  Footer.tsx        - Site footer
  Hero.tsx          - Hero section
  HomeContent.tsx   - Homepage sections
  Navbar.tsx        - Navigation with mobile menu
  Preloader.tsx     - Animated loading screen

lib/
  supabase/         - Supabase client configuration
  actions.ts        - Server actions
  types.ts          - TypeScript types
  utils.ts          - Utility functions
```

## Booking System

The booking system supports multiple service types:
- Keynote Speaking (inquiry only)
- Masterclass (inquiry only)
- Mentoring (inquiry only)
- Podcast Appearance (inquiry only)
- One-on-One Coaching ($1000 USD with payment)
- Consultation 30 mins ($99 USD with payment + Cal.com scheduling)

After payment for consultations, users are redirected to Cal.com to schedule their session.

## Payment Integration

Payments are processed through Paystack:
- Prices displayed in both USD and GHS
- Real-time exchange rate conversion
- Payment confirmation stored in database
- Admin email notifications on new bookings

## Customization

### Colors
The color scheme uses a Navy Blue Suit palette. Edit the `--primary` variable in `globals.css`:

```css
--primary: 217 91% 60%; /* Trust Blue */
```

### Typography
Fonts are configured in `layout.tsx`:
- Body: Plus Jakarta Sans
- Headings: Outfit

### Services
Services are loaded from the database. Edit via Supabase Table Editor.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Services not showing
- Check Supabase connection
- Verify environment variables
- Check browser console for errors

### Payment not working
- Verify Paystack keys are correct
- Ensure PAYSTACK_SECRET_KEY is set
- Check Paystack dashboard for test mode

### Cal.com 404 error
- Verify the event slug matches your Cal.com event
- Check that Cal.com account is active

### Build errors
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

## License

Copyright 2025 Sarpong Andrews Boakye. All rights reserved.
