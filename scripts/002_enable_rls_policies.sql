-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Livestock policies
CREATE POLICY "Farmers can view their own livestock" ON public.livestock
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own livestock" ON public.livestock
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own livestock" ON public.livestock
  FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own livestock" ON public.livestock
  FOR DELETE USING (auth.uid() = farmer_id);

-- Health records policies
CREATE POLICY "Farmers can view their own health records" ON public.health_records
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own health records" ON public.health_records
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own health records" ON public.health_records
  FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own health records" ON public.health_records
  FOR DELETE USING (auth.uid() = farmer_id);

-- Risk assessments policies
CREATE POLICY "Farmers can view their own risk assessments" ON public.risk_assessments
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own risk assessments" ON public.risk_assessments
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own risk assessments" ON public.risk_assessments
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Alerts policies (farmers can see alerts for them or general alerts)
CREATE POLICY "Users can view their alerts or general alerts" ON public.alerts
  FOR SELECT USING (farmer_id IS NULL OR auth.uid() = farmer_id);

CREATE POLICY "Users can update their alert read status" ON public.alerts
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Farmers can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Public read access for reference tables
ALTER TABLE public.livestock_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view livestock types" ON public.livestock_types
  FOR SELECT USING (true);

ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view diseases" ON public.diseases
  FOR SELECT USING (true);

ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published educational content" ON public.educational_content
  FOR SELECT USING (is_published = true);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions
  FOR SELECT USING (true);
