-- Create investigations table
CREATE TABLE IF NOT EXISTS investigations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  targets TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}'
);

-- Create findings table
CREATE TABLE IF NOT EXISTS findings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('ip', 'domain', 'cve', 'malware', 'indicator', 'note')),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(20) DEFAULT 'discovery' CHECK (event_type IN ('discovery', 'analysis', 'correlation', 'action')),
  source VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'
);

-- Create intelligence_cache table for storing API results
CREATE TABLE IF NOT EXISTS intelligence_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target VARCHAR(255) NOT NULL,
  source VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  UNIQUE(target, source)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigations_priority ON investigations(priority);
CREATE INDEX IF NOT EXISTS idx_investigations_created_by ON investigations(created_by);
CREATE INDEX IF NOT EXISTS idx_findings_investigation_id ON findings(investigation_id);
CREATE INDEX IF NOT EXISTS idx_findings_type ON findings(type);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_timeline_events_investigation_id ON timeline_events(investigation_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_cache_target ON intelligence_cache(target);
CREATE INDEX IF NOT EXISTS idx_intelligence_cache_expires ON intelligence_cache(expires_at);

-- Enable Row Level Security
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on investigations" ON investigations FOR ALL USING (true);
CREATE POLICY "Allow all operations on findings" ON findings FOR ALL USING (true);
CREATE POLICY "Allow all operations on timeline_events" ON timeline_events FOR ALL USING (true);
CREATE POLICY "Allow all operations on intelligence_cache" ON intelligence_cache FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_investigations_updated_at BEFORE UPDATE ON investigations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON findings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
