-- =====================================================
-- Bookings Schema Extension
-- =====================================================
-- Run this file in your Supabase SQL Editor after schema.sql
-- =====================================================

-- Booking types enum
CREATE TYPE booking_type AS ENUM (
  'keynote',
  'masterclass',
  'mentoring',
  'podcast',
  'voice_training',
  'articulacy_storytelling',
  'commanding_presence',
  'one_on_one_coaching',
  'consultation'
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  booking_type booking_type NOT NULL,
  additional_info TEXT, -- Service-specific details (theme, aspect, subject, etc.)
  price DECIMAL(10, 2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can create a booking (public form)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- Users can view their own bookings by email
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Service pricing reference (for UI display)
-- =====================================================
COMMENT ON TABLE bookings IS 'Booking requests for various services. Pricing: One-on-one Coaching = $1000, Consultation = $99, Others = Contact for pricing';
