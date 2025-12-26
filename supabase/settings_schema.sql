-- Add notification preference columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_updates BOOLEAN DEFAULT false;

-- Function/Trigger is not strictly needed if we just update these columns directly, 
-- but ensuring the updated_at trigger exists (which it should from schema.sql) is good.
