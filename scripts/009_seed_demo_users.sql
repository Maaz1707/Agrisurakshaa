-- Insert demo user profiles for testing and demonstration
-- Note: These profiles will be created when the corresponding auth.users are created
-- The handle_new_user() trigger will automatically create these profiles

-- Demo Farmer Profile (Ramu)
-- This assumes a user with email 'ramu@demo.com' exists in auth.users
-- The profile will be created automatically by the trigger

-- Update existing demo user profile if it exists
UPDATE public.profiles 
SET 
  full_name = 'Ramu Kumar',
  farm_name = 'Green Valley Farm',
  farm_address = '123 Agricultural Road, Rural District, State 12345',
  farm_size_acres = 25.5,
  registration_number = 'FARM-2024-001',
  preferred_language = 'en',
  phone = '+91-98765-43210'
WHERE email = 'ramu@demo.com' OR id = '550e8400-e29b-41d4-a716-446655440000';

-- Insert demo profile if it doesn't exist (for the hardcoded UUID used in other seed files)
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  phone,
  role,
  farm_name,
  farm_address,
  farm_size_acres,
  registration_number,
  preferred_language
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'ramu@demo.com',
  'Ramu Kumar',
  '+91-98765-43210',
  'farmer',
  'Green Valley Farm',
  '123 Agricultural Road, Rural District, State 12345',
  25.5,
  'FARM-2024-001',
  'en'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  farm_name = EXCLUDED.farm_name,
  farm_address = EXCLUDED.farm_address,
  farm_size_acres = EXCLUDED.farm_size_acres,
  registration_number = EXCLUDED.registration_number,
  phone = EXCLUDED.phone,
  preferred_language = EXCLUDED.preferred_language;

-- Demo Veterinarian Profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  phone,
  role,
  farm_name,
  farm_address,
  farm_size_acres,
  registration_number,
  preferred_language
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'dr.singh@demo.com',
  'Dr. Rajesh Singh',
  '+91-98765-43211',
  'veterinarian',
  'Veterinary Clinic',
  '456 Medical Center, City District, State 12345',
  NULL,
  'VET-2024-001',
  'en'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  farm_name = EXCLUDED.farm_name,
  farm_address = EXCLUDED.farm_address,
  registration_number = EXCLUDED.registration_number,
  preferred_language = EXCLUDED.preferred_language;

-- Demo Admin Profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  phone,
  role,
  farm_name,
  farm_address,
  farm_size_acres,
  registration_number,
  preferred_language
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'admin@demo.com',
  'Admin User',
  '+91-98765-43212',
  'admin',
  'System Administration',
  '789 Admin Building, Tech District, State 12345',
  NULL,
  'ADMIN-2024-001',
  'en'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  farm_name = EXCLUDED.farm_name,
  farm_address = EXCLUDED.farm_address,
  registration_number = EXCLUDED.registration_number,
  preferred_language = EXCLUDED.preferred_language;
