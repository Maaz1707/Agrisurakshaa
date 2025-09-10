-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'farmer')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_livestock_updated_at
  BEFORE UPDATE ON public.livestock
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON public.health_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate risk score based on assessment answers
CREATE OR REPLACE FUNCTION public.calculate_risk_score(questions JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  total_score INTEGER := 0;
  question JSONB;
BEGIN
  FOR question IN SELECT * FROM jsonb_array_elements(questions)
  LOOP
    -- Add scoring logic based on question type and answers
    -- This is a simplified example - actual scoring would be more complex
    IF (question->>'risk_weight')::INTEGER IS NOT NULL THEN
      total_score := total_score + (question->>'risk_weight')::INTEGER;
    END IF;
  END LOOP;
  
  -- Normalize to 0-100 scale
  RETURN LEAST(100, GREATEST(0, total_score));
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_livestock_farmer_id ON public.livestock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_livestock_health_status ON public.livestock(health_status);
CREATE INDEX IF NOT EXISTS idx_health_records_livestock_id ON public.health_records(livestock_id);
CREATE INDEX IF NOT EXISTS idx_health_records_farmer_id ON public.health_records(farmer_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON public.health_records(record_date);
CREATE INDEX IF NOT EXISTS idx_alerts_farmer_id ON public.alerts(farmer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type_severity ON public.alerts(alert_type, severity);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_farmer_id ON public.risk_assessments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON public.educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_species ON public.educational_content USING GIN(target_species);
