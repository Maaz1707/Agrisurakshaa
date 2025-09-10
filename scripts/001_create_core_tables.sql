-- Digital Biosecurity Portal Database Schema
-- Core tables for farmers, livestock, and health management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'veterinarian', 'admin')),
  farm_name TEXT,
  farm_address TEXT,
  farm_size_acres DECIMAL,
  registration_number TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'te', 'ta', 'kn', 'ml')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Livestock types reference table
CREATE TABLE IF NOT EXISTS public.livestock_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('pig', 'poultry')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Livestock inventory
CREATE TABLE IF NOT EXISTS public.livestock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  livestock_type_id UUID NOT NULL REFERENCES public.livestock_types(id),
  tag_number TEXT NOT NULL,
  batch_number TEXT,
  age_months INTEGER,
  weight_kg DECIMAL,
  gender TEXT CHECK (gender IN ('male', 'female')),
  health_status TEXT NOT NULL DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'sick', 'quarantine', 'deceased')),
  acquisition_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(farmer_id, tag_number)
);

-- Health records
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  livestock_id UUID NOT NULL REFERENCES public.livestock(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('vaccination', 'treatment', 'checkup', 'symptom', 'death')),
  title TEXT NOT NULL,
  description TEXT,
  symptoms TEXT[],
  treatment_given TEXT,
  medication TEXT,
  dosage TEXT,
  veterinarian_name TEXT,
  cost DECIMAL,
  record_date DATE NOT NULL,
  follow_up_date DATE,
  attachments TEXT[], -- URLs to images/documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disease database
CREATE TABLE IF NOT EXISTS public.diseases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('viral', 'bacterial', 'parasitic', 'fungal', 'nutritional', 'genetic')),
  affected_species TEXT[] NOT NULL, -- ['pig', 'poultry']
  symptoms TEXT[] NOT NULL,
  prevention_measures TEXT[],
  treatment_options TEXT[],
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  is_contagious BOOLEAN DEFAULT FALSE,
  incubation_period_days INTEGER,
  mortality_rate DECIMAL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk assessments
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('biosecurity', 'disease_outbreak', 'environmental', 'management')),
  title TEXT NOT NULL,
  questions JSONB NOT NULL, -- Store questions and answers
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  recommendations TEXT[],
  action_items TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts and notifications
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('disease_outbreak', 'vaccination_due', 'health_checkup', 'weather', 'market_price', 'regulatory')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'emergency')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  location TEXT, -- Geographic area affected
  affected_species TEXT[], -- ['pig', 'poultry']
  action_required BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_via TEXT[], -- ['app', 'sms', 'whatsapp', 'email']
  metadata JSONB, -- Additional alert-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Educational content
CREATE TABLE IF NOT EXISTS public.educational_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'infographic', 'quiz', 'checklist')),
  category TEXT NOT NULL CHECK (category IN ('biosecurity', 'disease_prevention', 'nutrition', 'housing', 'breeding', 'marketing')),
  target_species TEXT[] NOT NULL, -- ['pig', 'poultry']
  language TEXT NOT NULL DEFAULT 'en',
  content_url TEXT, -- For videos, PDFs, etc.
  content_text TEXT, -- For articles
  thumbnail_url TEXT,
  duration_minutes INTEGER, -- For videos
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES public.educational_content(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'text')),
  options JSONB, -- For multiple choice questions
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User quiz attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.educational_content(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Store user answers
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken_seconds INTEGER
);

-- Reports and analytics
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('health_summary', 'vaccination_schedule', 'mortality_report', 'financial_summary', 'risk_assessment_summary')),
  title TEXT NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  data JSONB NOT NULL, -- Store report data
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_url TEXT -- URL to generated PDF
);

-- Insert default livestock types
INSERT INTO public.livestock_types (name, category, description) VALUES
('Large White Pig', 'pig', 'Popular commercial pig breed known for good growth rate'),
('Landrace Pig', 'pig', 'Lean pig breed with excellent mothering ability'),
('Yorkshire Pig', 'pig', 'Hardy breed suitable for various climatic conditions'),
('Broiler Chicken', 'poultry', 'Fast-growing chicken breed for meat production'),
('Layer Chicken', 'poultry', 'High egg-producing chicken breed'),
('Desi Chicken', 'poultry', 'Indigenous chicken breed with disease resistance'),
('Duck', 'poultry', 'Waterfowl suitable for meat and egg production'),
('Turkey', 'poultry', 'Large poultry bird for meat production')
ON CONFLICT (name) DO NOTHING;

-- Insert common diseases
INSERT INTO public.diseases (name, category, affected_species, symptoms, prevention_measures, treatment_options, severity_level, is_contagious) VALUES
('African Swine Fever', 'viral', ARRAY['pig'], ARRAY['High fever', 'Loss of appetite', 'Skin lesions', 'Sudden death'], ARRAY['Strict biosecurity', 'Quarantine new animals', 'Disinfection'], ARRAY['No treatment available', 'Immediate isolation', 'Report to authorities'], 'critical', true),
('Classical Swine Fever', 'viral', ARRAY['pig'], ARRAY['Fever', 'Loss of appetite', 'Skin discoloration', 'Diarrhea'], ARRAY['Vaccination', 'Biosecurity measures', 'Movement control'], ARRAY['Supportive care', 'Isolation', 'Vaccination'], 'high', true),
('Avian Influenza', 'viral', ARRAY['poultry'], ARRAY['Sudden death', 'Drop in egg production', 'Respiratory distress', 'Swollen head'], ARRAY['Biosecurity', 'Vaccination', 'Wild bird control'], ARRAY['Isolation', 'Supportive care', 'Antiviral drugs'], 'critical', true),
('Newcastle Disease', 'viral', ARRAY['poultry'], ARRAY['Respiratory distress', 'Nervous signs', 'Drop in egg production', 'Diarrhea'], ARRAY['Vaccination', 'Biosecurity', 'Quarantine'], ARRAY['Supportive care', 'Vaccination', 'Isolation'], 'high', true),
('Foot and Mouth Disease', 'viral', ARRAY['pig'], ARRAY['Fever', 'Blisters on feet and mouth', 'Lameness', 'Loss of appetite'], ARRAY['Vaccination', 'Movement restrictions', 'Disinfection'], ARRAY['Supportive care', 'Isolation', 'Wound care'], 'high', true)
ON CONFLICT (name) DO NOTHING;
