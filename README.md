# Sarpong Andrews Boakye - Portfolio Website

A high-performance portfolio website for a communication coach and entrepreneur, built with Next.js 14 and Supabase.

## Design Features

- Executive Dark Mode: Deep black background with metallic accents
- Glassmorphism: Backdrop blur effects on navigation and cards
- Smooth Animations: Framer Motion scroll animations and hover effects
- Responsive Design: Mobile-first approach with hamburger menu
- Premium Typography: Plus Jakarta Sans for body, Outfit for headings

## Tech Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + Shadcn UI
- Animation: Framer Motion
- Database: Supabase (PostgreSQL)
- Icons: Lucide React
- Booking: Cal.com integration
- Payments: Paystack
- Language: TypeScript

## Prerequisites

Before you begin, ensure you have:

1. Node.js (v18 or higher)
2. npm or yarn
3. Supabase Account - https://supabase.com
4. Cal.com Account - https://cal.com
5. Paystack Account - https://paystack.com

## Setup Instructions

### Step 1: Database Setup

1. Go to your Supabase Dashboard
2. Create a new project (or use an existing one)
3. Navigate to the SQL Editor
4. Copy the contents of `schema.sql` and run it in the SQL Editor
5. Verify the tables were created in the Table Editor

### Step 2: Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CALCOM_USERNAME=your_calcom_username
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   ```

   Finding your Supabase credentials:
   - Go to Project Settings > API
   - Copy the "Project URL" and "anon public" key

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
├── app/
│   ├── booking/          # Cal.com booking page
│   ├── courses/          # Course purchase pages
│   ├── dashboard/        # Student dashboard (auth required)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── CourseCard.tsx    # Course display card
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Hero section
│   └── Navbar.tsx        # Navigation with mobile menu
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── actions.ts        # Server actions
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── schema.sql            # Database schema
```

## Features

### Landing Page
- Hero section with portrait cutout
- About section with personal brand story
- School of Presence mission
- Dynamic Services - Fetched from Supabase database
- Trekenvyl venture showcase
- Call-to-action section

### Courses
- Course purchase with Paystack integration
- Course grid display
- Waitlist functionality

### Booking Page
- Cal.com embed integration
- Dark theme styling

### Dashboard
- Protected route (requires authentication)
- Display purchased courses
- Course access and progress tracking

## Database Schema

The database includes:
- services: Communication services offered
- courses: Online courses
- purchases: Course purchase tracking with payment reference
- profiles: User profiles
- course_progress: Learning progress tracking
- waitlist: Course waitlist signups

All tables have Row Level Security (RLS) enabled for data protection.

## Customization

### Colors
The color scheme uses a Navy Blue Suit palette (Dark, Calm & Trustworthy). Colors are defined in `app/globals.css` using CSS variables. To change the primary accent color, edit the `--primary` variable in `globals.css`:
```css
--primary: 217 91% 60%; /* Trust Blue: #3b82f6 */
```

### Typography
Fonts are configured in `app/layout.tsx`:
- Body: Plus Jakarta Sans
- Headings: Outfit

### Services
Services are dynamically loaded from the database. To add/edit services:
1. Go to Supabase Table Editor
2. Edit the `services` table
3. Changes will reflect automatically

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Services not showing?
- Verify `schema.sql` was run successfully in Supabase
- Check browser console for errors
- Verify environment variables are set correctly

### Cal.com not loading?
- Ensure `NEXT_PUBLIC_CALCOM_USERNAME` is set in `.env.local`
- Check that your Cal.com account is active

### Payment not working?
- Verify Paystack keys are set correctly
- Check that PAYSTACK_SECRET_KEY is set (server-side only)

### Build errors?
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

Copyright 2025 Sarpong Andrews Boakye. All rights reserved.
