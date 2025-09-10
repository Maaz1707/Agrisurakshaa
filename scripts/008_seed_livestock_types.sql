-- Seed livestock types for the biosecurity portal
-- This script adds basic livestock types that farmers can select from

-- Insert livestock types
INSERT INTO public.livestock_types (id, name, category, description) VALUES
  (uuid_generate_v4(), 'Pig', 'pig', 'Domestic pig for meat production'),
  (uuid_generate_v4(), 'Boar', 'pig', 'Male pig for breeding'),
  (uuid_generate_v4(), 'Sow', 'pig', 'Female pig for breeding'),
  (uuid_generate_v4(), 'Piglet', 'pig', 'Young pig under 6 months'),
  (uuid_generate_v4(), 'Chicken', 'poultry', 'Domestic chicken for eggs and meat'),
  (uuid_generate_v4(), 'Rooster', 'poultry', 'Male chicken'),
  (uuid_generate_v4(), 'Hen', 'poultry', 'Female chicken for egg production'),
  (uuid_generate_v4(), 'Chick', 'poultry', 'Young chicken under 8 weeks'),
  (uuid_generate_v4(), 'Duck', 'poultry', 'Domestic duck'),
  (uuid_generate_v4(), 'Goose', 'poultry', 'Domestic goose')
ON CONFLICT (name) DO NOTHING;

-- Insert sample educational content
INSERT INTO public.educational_content (id, title, description, content_type, category, duration_minutes, difficulty_level, content_url, thumbnail_url) VALUES
  (uuid_generate_v4(), 'Introduction to Farm Biosecurity', 'Learn the fundamentals of farm biosecurity practices', 'video', 'biosecurity', 45, 'beginner', 'https://example.com/video1', '/farm-biosecurity-introduction.jpg'),
  (uuid_generate_v4(), 'Disease Prevention Best Practices', 'Essential practices to prevent disease outbreaks', 'article', 'disease_prevention', 15, 'intermediate', 'https://example.com/article1', '/livestock-disease-prevention.jpg'),
  (uuid_generate_v4(), 'Livestock Health Assessment Quiz', 'Test your knowledge of livestock health indicators', 'quiz', 'disease_prevention', 10, 'beginner', 'https://example.com/quiz1', '/poultry-health-examination.jpg'),
  (uuid_generate_v4(), 'Advanced Farm Management', 'Advanced techniques for efficient farm operations', 'video', 'management', 60, 'advanced', 'https://example.com/video2', '/advanced-farm-biosecurity.jpg'),
  (uuid_generate_v4(), 'Animal Nutrition Fundamentals', 'Understanding proper nutrition for healthy livestock', 'article', 'nutrition', 25, 'intermediate', 'https://example.com/article2', '/animal-feed-quality-testing.jpg')
ON CONFLICT (title) DO NOTHING;

-- Insert sample alerts
INSERT INTO public.alerts (id, farmer_id, title, message, alert_type, severity, status) VALUES
  (uuid_generate_v4(), (SELECT id FROM public.profiles WHERE role = 'farmer' LIMIT 1), 'Welcome to Biosecurity Portal', 'Welcome to your digital biosecurity management system! Start by adding your livestock inventory.', 'management', 'low', 'active'),
  (uuid_generate_v4(), (SELECT id FROM public.profiles WHERE role = 'farmer' LIMIT 1), 'Complete Your Profile', 'Please complete your farm profile to access all features.', 'management', 'medium', 'active')
ON CONFLICT DO NOTHING;
