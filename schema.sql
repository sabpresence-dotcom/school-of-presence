-- =====================================================
-- Sarpong Andrews Boakye Portfolio - Database Schema
-- =====================================================
-- Run this file in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table (for user/admin information)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table (Communication services offered)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL, -- lucide-react icon name
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table (Online courses)
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT, -- Full course details
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    video_url TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    duration INTEGER DEFAULT 0, -- Duration in minutes
    commitment_period TEXT, -- e.g. "14 Days"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases table (Track course purchases)
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_reference TEXT UNIQUE, -- Paystack reference for idempotency
    UNIQUE(user_id, course_id) -- Prevent duplicate purchases
);

-- Course Progress table (Track user learning)
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    minutes_watched INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Waitlist table (For course waitlist signups)
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- INDEXES (Performance Optimization)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON purchases(course_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Services: Public read access
CREATE POLICY "Services are publicly readable"
    ON services FOR SELECT
    TO PUBLIC
    USING (true);

-- Courses: Public can read published courses
CREATE POLICY "Published courses are publicly readable"
    ON courses FOR SELECT
    TO PUBLIC
    USING (is_published = true);

-- Purchases: Users can only read their own purchases
CREATE POLICY "Users can view own purchases"
    ON purchases FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases"
    ON purchases FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Course Progress: Users can manage their own progress
CREATE POLICY "Users can view own progress"
    ON course_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON course_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON course_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Waitlist: Anyone can insert, only admins can read
CREATE POLICY "Anyone can join waitlist"
    ON waitlist FOR INSERT
    TO PUBLIC
    WITH CHECK (true);

CREATE POLICY "Only authenticated users can view waitlist"
    ON waitlist FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SEED DATA - Services
-- =====================================================

INSERT INTO services (title, description, icon_name, display_order) VALUES
(
    'Communication Consultation',
    'Refine your message, delivery, and overall communication strategy.',
    'MessageSquare',
    1
),
(
    'Team Training & Workshops',
    'Interactive sessions for companies, institutions, and groups focused on leadership presence.',
    'Users',
    2
),
(
    'One-on-One Coaching',
    'Personalised coaching to build your communication confidence.',
    'User',
    3
),
(
    'Focused Courses',
    'Deep-dive learning in public speaking, voice, and storytelling.',
    'GraduationCap',
    4
)
ON CONFLICT DO NOTHING;

-- SEED DATA - Courses
INSERT INTO courses (title, description, long_description, display_order, price, is_published) VALUES
(
    'Speak Confidently from Day One',
    'Introduction to Public Speaking',
    NULL,
    1,
    0.00,
    TRUE
),
(
    'Articulate with Impact',
    'Storytelling & Thought Clarity Mastery',
    NULL,
    2,
    0.00,
    TRUE
),
(
    'Command Attention',
    'Voice Power, Projection & Engagement',
    NULL,
    3,
    0.00,
    TRUE
),
(
    'Show Up Boldly',
    'Presence & Confidence Mastery',
    NULL,
    4,
    0.00,
    TRUE
),
(
    'Effortless Content Creation',
    'Organise Thoughts for Video & Reels',
    NULL,
    5,
    0.00,
    TRUE
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify setup:
-- SELECT * FROM services ORDER BY display_order;
-- SELECT * FROM courses WHERE is_published = true;
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
