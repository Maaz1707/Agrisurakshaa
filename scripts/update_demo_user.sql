-- Quick script to update the demo user name from Charlie to Ramu
-- Run this script in your Supabase SQL editor or database client

-- Update the demo user profile to use Ramu instead of Charlie
UPDATE public.profiles 
SET 
  full_name = 'Ramu Kumar',
  farm_name = 'Green Valley Farm',
  farm_address = '123 Agricultural Road, Rural District, State 12345',
  farm_size_acres = 25.5,
  registration_number = 'FARM-2024-001',
  preferred_language = 'en',
  phone = '+91-98765-43210'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Verify the update
SELECT id, email, full_name, farm_name, role 
FROM public.profiles 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
