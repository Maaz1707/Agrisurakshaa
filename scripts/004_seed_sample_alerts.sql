-- Insert sample alerts for demonstration
INSERT INTO public.alerts (
  farmer_id,
  alert_type,
  severity,
  title,
  message,
  location,
  affected_species,
  action_required,
  is_read,
  sent_via,
  metadata
) VALUES
-- Critical disease outbreak alert
(
  NULL, -- General alert for all farmers
  'disease_outbreak',
  'critical',
  'African Swine Fever Outbreak Detected',
  'A confirmed case of African Swine Fever has been reported in the neighboring district. Immediate biosecurity measures are required to prevent spread.',
  'Neighboring District',
  ARRAY['pig'],
  true,
  false,
  ARRAY['app'],
  '{"source": "veterinary_department", "case_id": "ASF-2024-001"}'
),
-- Vaccination reminder
(
  NULL,
  'vaccination_due',
  'warning',
  'Seasonal Vaccination Due',
  'Annual vaccination schedule indicates that seasonal vaccinations for poultry are due this month. Contact your veterinarian to schedule.',
  NULL,
  ARRAY['poultry'],
  true,
  false,
  ARRAY['app'],
  '{"vaccine_type": "seasonal", "due_date": "2024-12-31"}'
),
-- Weather alert
(
  NULL,
  'weather',
  'warning',
  'Severe Weather Warning',
  'Heavy rainfall and strong winds expected in the next 48 hours. Secure livestock housing and ensure proper drainage.',
  'Regional',
  ARRAY['pig', 'poultry'],
  true,
  false,
  ARRAY['app'],
  '{"weather_type": "storm", "duration": "48_hours"}'
),
-- Market price update
(
  NULL,
  'market_price',
  'info',
  'Market Price Update',
  'Pig prices have increased by 15% this week due to high demand. Consider timing your sales accordingly.',
  'Local Market',
  ARRAY['pig'],
  false,
  false,
  ARRAY['app'],
  '{"price_change": "+15%", "commodity": "pig"}'
),
-- Regulatory update
(
  NULL,
  'regulatory',
  'info',
  'New Biosecurity Guidelines Released',
  'The Department of Animal Husbandry has released updated biosecurity guidelines for pig and poultry farms. Review the new requirements.',
  NULL,
  ARRAY['pig', 'poultry'],
  false,
  false,
  ARRAY['app'],
  '{"document_id": "BG-2024-V2", "effective_date": "2025-01-01"}'
),
-- Health checkup reminder
(
  NULL,
  'health_checkup',
  'info',
  'Monthly Health Checkup Reminder',
  'It\'s time for your monthly livestock health assessment. Schedule a checkup with your veterinarian or conduct self-assessment.',
  NULL,
  ARRAY['pig', 'poultry'],
  false,
  false,
  ARRAY['app'],
  '{"checkup_type": "monthly", "last_checkup": "2024-11-01"}'
);
