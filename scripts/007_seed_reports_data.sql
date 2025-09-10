-- Insert sample report templates
INSERT INTO report_templates (name, description, category, template_config, created_by) VALUES
('Monthly Health Summary', 'Comprehensive health overview with trends and recommendations', 'Health', 
 '{"sections": ["health_overview", "trends", "recommendations"], "charts": ["health_trends", "vaccination_status"], "format": "pdf"}',
 '550e8400-e29b-41d4-a716-446655440000'),

('Quarterly Risk Assessment', 'Detailed risk analysis across all farm operations', 'Risk',
 '{"sections": ["risk_overview", "category_analysis", "mitigation_plans"], "charts": ["risk_distribution", "trend_analysis"], "format": "pdf"}',
 '550e8400-e29b-41d4-a716-446655440000'),

('Compliance Audit Report', 'Regulatory compliance status and action items', 'Compliance',
 '{"sections": ["compliance_status", "violations", "action_items"], "charts": ["compliance_trends"], "format": "pdf"}',
 '550e8400-e29b-41d4-a716-446655440000'),

('Performance Dashboard', 'Key performance indicators and productivity metrics', 'Performance',
 '{"sections": ["kpi_overview", "productivity_metrics", "efficiency_analysis"], "charts": ["performance_trends", "comparative_analysis"], "format": "pdf"}',
 '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample generated reports
INSERT INTO generated_reports (title, report_type, template_id, generated_by, file_path, file_size, status, parameters) VALUES
('Monthly Health Summary - November 2024', 'Health Report', 
 (SELECT id FROM report_templates WHERE name = 'Monthly Health Summary'), 
 '550e8400-e29b-41d4-a716-446655440000', 
 '/reports/health-summary-nov-2024.pdf', 2457600, 'completed',
 '{"date_range": {"from": "2024-11-01", "to": "2024-11-30"}, "farms": ["all"]}'),

('Biosecurity Risk Assessment Q4 2024', 'Risk Assessment',
 (SELECT id FROM report_templates WHERE name = 'Quarterly Risk Assessment'),
 '550e8400-e29b-41d4-a716-446655440000',
 '/reports/risk-assessment-q4-2024.pdf', 1887436, 'completed',
 '{"date_range": {"from": "2024-10-01", "to": "2024-12-31"}, "risk_categories": ["all"]}'),

('Compliance Audit Report - November', 'Compliance',
 (SELECT id FROM report_templates WHERE name = 'Compliance Audit Report'),
 '550e8400-e29b-41d4-a716-446655440000',
 '/reports/compliance-audit-nov-2024.pdf', 3248576, 'completed',
 '{"date_range": {"from": "2024-11-01", "to": "2024-11-30"}, "audit_type": "monthly"}');

-- Insert sample analytics metrics
INSERT INTO analytics_metrics (user_id, metric_type, metric_name, metric_value, metric_unit, recorded_at, metadata) VALUES
-- Health metrics
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 94.2, 'percentage', NOW() - INTERVAL '1 day', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'vaccination_rate', 98.7, 'percentage', NOW() - INTERVAL '1 day', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'sick_animals', 12, 'count', NOW() - INTERVAL '1 day', '{"farm_id": "main", "livestock_type": "all"}'),

-- Risk metrics
('550e8400-e29b-41d4-a716-446655440000', 'risk', 'biosecurity_risk_level', 2.1, 'score', NOW() - INTERVAL '1 day', '{"category": "biosecurity", "max_score": 10}'),
('550e8400-e29b-41d4-a716-446655440000', 'risk', 'disease_risk_level', 2.8, 'score', NOW() - INTERVAL '1 day', '{"category": "disease", "max_score": 10}'),
('550e8400-e29b-41d4-a716-446655440000', 'risk', 'environmental_risk_level', 1.5, 'score', NOW() - INTERVAL '1 day', '{"category": "environmental", "max_score": 10}'),

-- Compliance metrics
('550e8400-e29b-41d4-a716-446655440000', 'compliance', 'compliance_rate', 98.7, 'percentage', NOW() - INTERVAL '1 day', '{"audit_type": "monthly"}'),
('550e8400-e29b-41d4-a716-446655440000', 'compliance', 'overdue_items', 1, 'count', NOW() - INTERVAL '1 day', '{"severity": "medium"}'),

-- Performance metrics
('550e8400-e29b-41d4-a716-446655440000', 'performance', 'feed_efficiency', 2.8, 'ratio', NOW() - INTERVAL '1 day', '{"livestock_type": "pigs"}'),
('550e8400-e29b-41d4-a716-446655440000', 'performance', 'mortality_rate', 1.2, 'percentage', NOW() - INTERVAL '1 day', '{"livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'performance', 'growth_rate', 0.85, 'kg_per_day', NOW() - INTERVAL '1 day', '{"livestock_type": "pigs"});

-- Insert historical data for trends (last 6 months)
INSERT INTO analytics_metrics (user_id, metric_type, metric_name, metric_value, metric_unit, recorded_at, metadata) VALUES
-- Health trends
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 95.0, 'percentage', NOW() - INTERVAL '30 days', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 93.5, 'percentage', NOW() - INTERVAL '60 days', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 96.2, 'percentage', NOW() - INTERVAL '90 days', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 94.8, 'percentage', NOW() - INTERVAL '120 days', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 97.1, 'percentage', NOW() - INTERVAL '150 days', '{"farm_id": "main", "livestock_type": "all"}'),
('550e8400-e29b-41d4-a716-446655440000', 'health', 'overall_health_score', 95.3, 'percentage', NOW() - INTERVAL '180 days', '{"farm_id": "main", "livestock_type": "all"}');
