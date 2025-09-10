-- Create reports and analytics tables
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    template_config JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    template_id UUID REFERENCES report_templates(id),
    generated_by UUID REFERENCES auth.users(id),
    file_path VARCHAR(500),
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'generating',
    parameters JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,2),
    metric_unit VARCHAR(50),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_report_templates_category ON report_templates(category);
CREATE INDEX IF NOT EXISTS idx_generated_reports_type ON generated_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_generated_reports_user ON generated_reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_user_type ON analytics_metrics(user_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_recorded_at ON analytics_metrics(recorded_at);

-- Enable RLS
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own report templates" ON report_templates
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create report templates" ON report_templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own report templates" ON report_templates
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can view their own generated reports" ON generated_reports
    FOR SELECT USING (generated_by = auth.uid());

CREATE POLICY "Users can create generated reports" ON generated_reports
    FOR INSERT WITH CHECK (generated_by = auth.uid());

CREATE POLICY "Users can view their own analytics metrics" ON analytics_metrics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics metrics" ON analytics_metrics
    FOR INSERT WITH CHECK (user_id = auth.uid());
