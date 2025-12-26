-- =====================================================
-- MIGRATION: Add Courses and Long Description
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- 1. Add 'long_description' column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'long_description') THEN
        ALTER TABLE courses ADD COLUMN long_description TEXT;
    END IF;
END $$;

-- 2. Insert the new courses
-- Note: 'commitment_period' and 'duration' are left as default (NULL/0) for now. 
-- You can update them later if needed.
INSERT INTO courses (title, description, long_description, display_order, price, is_published) VALUES
(
    'Speak Confidently from Day One',
    'Introduction to Public Speaking',
    NULL, -- Long description to be updated from Admin/CMS later
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

-- 3. Verify the changes
SELECT title, description, is_published FROM courses WHERE title IN (
    'Speak Confidently from Day One',
    'Articulate with Impact',
    'Command Attention',
    'Show Up Boldly',
    'Effortless Content Creation'
);
