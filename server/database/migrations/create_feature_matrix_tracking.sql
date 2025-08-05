-- Feature Matrix Tracking Table
-- This table tracks feature visibility and behavior for each plan type

CREATE TABLE IF NOT EXISTS feature_matrix_tracking (
  id SERIAL PRIMARY KEY,
  feature_section VARCHAR(50) NOT NULL, -- 'dashboard' or 'navMenu'
  feature_name VARCHAR(100) NOT NULL,
  plan_type VARCHAR(50) NOT NULL, -- 'free', 'basic', 'pro', 'premium', 'satellite_enterprise', 'driving_enterprise'
  feature_state VARCHAR(20) NOT NULL, -- 'shown', 'sample_data', 'paywall', 'not_shown'
  description TEXT,
  implementation_notes TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(feature_section, feature_name, plan_type)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_feature_matrix_section_plan ON feature_matrix_tracking(feature_section, plan_type);
CREATE INDEX IF NOT EXISTS idx_feature_matrix_plan_state ON feature_matrix_tracking(plan_type, feature_state);

-- Insert the feature matrix data based on the provided table
INSERT INTO feature_matrix_tracking (feature_section, feature_name, plan_type, feature_state, description) VALUES
-- Dashboard features
('dashboard', 'sampleRoads', 'free', 'sample_data', 'Sample road data displayed'),
('dashboard', 'sampleRoads', 'basic', 'sample_data', 'Sample road data displayed'),
('dashboard', 'sampleRoads', 'pro', 'sample_data', 'Sample road data displayed'),
('dashboard', 'sampleRoads', 'premium', 'sample_data', 'Sample road data displayed'),
('dashboard', 'sampleRoads', 'satellite_enterprise', 'shown', 'Actual road data from satellite scanning'),
('dashboard', 'sampleRoads', 'driving_enterprise', 'shown', 'Actual road data from driving scanning'),

('dashboard', 'averagePCIScore', 'free', 'sample_data', 'Sample PCI score data'),
('dashboard', 'averagePCIScore', 'basic', 'sample_data', 'Sample PCI score data'),
('dashboard', 'averagePCIScore', 'pro', 'sample_data', 'Sample PCI score data'),
('dashboard', 'averagePCIScore', 'premium', 'sample_data', 'Sample PCI score data'),
('dashboard', 'averagePCIScore', 'satellite_enterprise', 'shown', 'Actual PCI scores from analysis'),
('dashboard', 'averagePCIScore', 'driving_enterprise', 'shown', 'Actual PCI scores from analysis'),

('dashboard', 'criticalIssues', 'free', 'sample_data', 'Sample critical issues data'),
('dashboard', 'criticalIssues', 'basic', 'shown', 'Real critical issues data'),
('dashboard', 'criticalIssues', 'pro', 'shown', 'Real critical issues data'),
('dashboard', 'criticalIssues', 'premium', 'shown', 'Real critical issues data'),
('dashboard', 'criticalIssues', 'satellite_enterprise', 'shown', 'Real critical issues data'),
('dashboard', 'criticalIssues', 'driving_enterprise', 'shown', 'Real critical issues data'),

('dashboard', 'monthlyBudget', 'free', 'sample_data', 'Sample budget data'),
('dashboard', 'monthlyBudget', 'basic', 'shown', 'Real budget data'),
('dashboard', 'monthlyBudget', 'pro', 'shown', 'Real budget data'),
('dashboard', 'monthlyBudget', 'premium', 'shown', 'Real budget data'),
('dashboard', 'monthlyBudget', 'satellite_enterprise', 'shown', 'Real budget data'),
('dashboard', 'monthlyBudget', 'driving_enterprise', 'shown', 'Real budget data'),

('dashboard', 'chooseYourPCIScanningMethod', 'free', 'shown', 'PCI scanning method selection available'),
('dashboard', 'chooseYourPCIScanningMethod', 'basic', 'shown', 'PCI scanning method selection available'),
('dashboard', 'chooseYourPCIScanningMethod', 'pro', 'shown', 'PCI scanning method selection available'),
('dashboard', 'chooseYourPCIScanningMethod', 'premium', 'shown', 'PCI scanning method selection available'),
('dashboard', 'chooseYourPCIScanningMethod', 'satellite_enterprise', 'not_shown', 'Method already selected'),
('dashboard', 'chooseYourPCIScanningMethod', 'driving_enterprise', 'not_shown', 'Method already selected'),

('dashboard', 'satelliteVsDrivingPCIScanComparison', 'free', 'shown', 'Comparison chart available'),
('dashboard', 'satelliteVsDrivingPCIScanComparison', 'basic', 'shown', 'Comparison chart available'),
('dashboard', 'satelliteVsDrivingPCIScanComparison', 'pro', 'shown', 'Comparison chart available'),
('dashboard', 'satelliteVsDrivingPCIScanComparison', 'premium', 'shown', 'Comparison chart available'),
('dashboard', 'satelliteVsDrivingPCIScanComparison', 'satellite_enterprise', 'not_shown', 'Not relevant for enterprise plans'),
('dashboard', 'satelliteVsDrivingPCIScanComparison', 'driving_enterprise', 'not_shown', 'Not relevant for enterprise plans'),

('dashboard', 'sampleDataControls', 'free', 'shown', 'Sample data controls available'),
('dashboard', 'sampleDataControls', 'basic', 'not_shown', 'Using real data'),
('dashboard', 'sampleDataControls', 'pro', 'not_shown', 'Using real data'),
('dashboard', 'sampleDataControls', 'premium', 'not_shown', 'Using real data'),
('dashboard', 'sampleDataControls', 'satellite_enterprise', 'not_shown', 'Using real data'),
('dashboard', 'sampleDataControls', 'driving_enterprise', 'not_shown', 'Using real data'),

-- Navigation Menu features
('navMenu', 'roadInspection', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'roadInspection', 'basic', 'shown', 'Full access to road inspection'),
('navMenu', 'roadInspection', 'pro', 'shown', 'Full access to road inspection'),
('navMenu', 'roadInspection', 'premium', 'shown', 'Full access to road inspection'),
('navMenu', 'roadInspection', 'satellite_enterprise', 'shown', 'Full access to road inspection'),
('navMenu', 'roadInspection', 'driving_enterprise', 'shown', 'Full access to road inspection'),

('navMenu', 'assetManager', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'assetManager', 'basic', 'shown', 'Full access to asset management'),
('navMenu', 'assetManager', 'pro', 'shown', 'Full access to asset management'),
('navMenu', 'assetManager', 'premium', 'shown', 'Full access to asset management'),
('navMenu', 'assetManager', 'satellite_enterprise', 'shown', 'Full access to asset management'),
('navMenu', 'assetManager', 'driving_enterprise', 'shown', 'Full access to asset management'),

('navMenu', 'maintenance', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'maintenance', 'basic', 'paywall', 'Requires Pro+ to access'),
('navMenu', 'maintenance', 'pro', 'shown', 'Full access to maintenance scheduling'),
('navMenu', 'maintenance', 'premium', 'shown', 'Full access to maintenance scheduling'),
('navMenu', 'maintenance', 'satellite_enterprise', 'shown', 'Full access to maintenance scheduling'),
('navMenu', 'maintenance', 'driving_enterprise', 'shown', 'Full access to maintenance scheduling'),

('navMenu', 'inspections', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'inspections', 'basic', 'paywall', 'Requires Pro+ to access'),
('navMenu', 'inspections', 'pro', 'shown', 'Full access to inspections'),
('navMenu', 'inspections', 'premium', 'shown', 'Full access to inspections'),
('navMenu', 'inspections', 'satellite_enterprise', 'shown', 'Full access to inspections'),
('navMenu', 'inspections', 'driving_enterprise', 'shown', 'Full access to inspections'),

('navMenu', 'mapView', 'free', 'sample_data', 'Map with sample data'),
('navMenu', 'mapView', 'basic', 'shown', 'Full map access with real data'),
('navMenu', 'mapView', 'pro', 'shown', 'Full map access with real data'),
('navMenu', 'mapView', 'premium', 'shown', 'Full map access with real data'),
('navMenu', 'mapView', 'satellite_enterprise', 'shown', 'Full map access with real data'),
('navMenu', 'mapView', 'driving_enterprise', 'shown', 'Full map access with real data'),

('navMenu', 'budgetPlanning', 'free', 'sample_data', 'Budget planning with sample data'),
('navMenu', 'budgetPlanning', 'basic', 'shown', 'Full budget planning access'),
('navMenu', 'budgetPlanning', 'pro', 'shown', 'Full budget planning access'),
('navMenu', 'budgetPlanning', 'premium', 'shown', 'Full budget planning access'),
('navMenu', 'budgetPlanning', 'satellite_enterprise', 'shown', 'Full budget planning access'),
('navMenu', 'budgetPlanning', 'driving_enterprise', 'shown', 'Full budget planning access'),

('navMenu', 'costEstimator', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'costEstimator', 'basic', 'shown', 'Full access to cost estimator'),
('navMenu', 'costEstimator', 'pro', 'shown', 'Full access to cost estimator'),
('navMenu', 'costEstimator', 'premium', 'shown', 'Full access to cost estimator'),
('navMenu', 'costEstimator', 'satellite_enterprise', 'shown', 'Full access to cost estimator'),
('navMenu', 'costEstimator', 'driving_enterprise', 'shown', 'Full access to cost estimator'),

('navMenu', 'fundingCenter', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'fundingCenter', 'basic', 'paywall', 'Requires Pro+ to access'),
('navMenu', 'fundingCenter', 'pro', 'shown', 'Full access to funding center'),
('navMenu', 'fundingCenter', 'premium', 'shown', 'Full access to funding center'),
('navMenu', 'fundingCenter', 'satellite_enterprise', 'shown', 'Full access to funding center'),
('navMenu', 'fundingCenter', 'driving_enterprise', 'shown', 'Full access to funding center'),

('navMenu', 'expenses', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'expenses', 'basic', 'shown', 'Full access to expense tracking'),
('navMenu', 'expenses', 'pro', 'shown', 'Full access to expense tracking'),
('navMenu', 'expenses', 'premium', 'shown', 'Full access to expense tracking'),
('navMenu', 'expenses', 'satellite_enterprise', 'shown', 'Full access to expense tracking'),
('navMenu', 'expenses', 'driving_enterprise', 'shown', 'Full access to expense tracking'),

('navMenu', 'contractors', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'contractors', 'basic', 'paywall', 'Requires Pro+ to access'),
('navMenu', 'contractors', 'pro', 'shown', 'Full access to contractor management'),
('navMenu', 'contractors', 'premium', 'shown', 'Full access to contractor management'),
('navMenu', 'contractors', 'satellite_enterprise', 'shown', 'Full access to contractor management'),
('navMenu', 'contractors', 'driving_enterprise', 'shown', 'Full access to contractor management'),

('navMenu', 'citizenReports', 'free', 'paywall', 'Requires upgrade to access'),
('navMenu', 'citizenReports', 'basic', 'paywall', 'Requires Pro+ to access'),
('navMenu', 'citizenReports', 'pro', 'shown', 'Full access to citizen reports'),
('navMenu', 'citizenReports', 'premium', 'shown', 'Full access to citizen reports'),
('navMenu', 'citizenReports', 'satellite_enterprise', 'shown', 'Full access to citizen reports'),
('navMenu', 'citizenReports', 'driving_enterprise', 'shown', 'Full access to citizen reports'),

('navMenu', 'reports', 'free', 'sample_data', 'Reports with sample data'),
('navMenu', 'reports', 'basic', 'shown', 'Full access to reports'),
('navMenu', 'reports', 'pro', 'shown', 'Full access to reports'),
('navMenu', 'reports', 'premium', 'shown', 'Full access to reports'),
('navMenu', 'reports', 'satellite_enterprise', 'shown', 'Full access to reports'),
('navMenu', 'reports', 'driving_enterprise', 'shown', 'Full access to reports'),

('navMenu', 'pricing', 'free', 'shown', 'Access to pricing page'),
('navMenu', 'pricing', 'basic', 'shown', 'Access to pricing page'),
('navMenu', 'pricing', 'pro', 'shown', 'Access to pricing page'),
('navMenu', 'pricing', 'premium', 'shown', 'Access to pricing page'),
('navMenu', 'pricing', 'satellite_enterprise', 'shown', 'Access to pricing page'),
('navMenu', 'pricing', 'driving_enterprise', 'shown', 'Access to pricing page'),

('navMenu', 'integrations', 'free', 'sample_data', 'Integrations with sample data'),
('navMenu', 'integrations', 'basic', 'shown', 'Full access to integrations'),
('navMenu', 'integrations', 'pro', 'shown', 'Full access to integrations'),
('navMenu', 'integrations', 'premium', 'shown', 'Full access to integrations'),
('navMenu', 'integrations', 'satellite_enterprise', 'shown', 'Full access to integrations'),
('navMenu', 'integrations', 'driving_enterprise', 'shown', 'Full access to integrations'),

('navMenu', 'settings', 'free', 'shown', 'Access to settings'),
('navMenu', 'settings', 'basic', 'shown', 'Access to settings'),
('navMenu', 'settings', 'pro', 'shown', 'Access to settings'),
('navMenu', 'settings', 'premium', 'shown', 'Access to settings'),
('navMenu', 'settings', 'satellite_enterprise', 'shown', 'Access to settings'),
('navMenu', 'settings', 'driving_enterprise', 'shown', 'Access to settings')

ON CONFLICT (feature_section, feature_name, plan_type) DO UPDATE SET
  feature_state = EXCLUDED.feature_state,
  description = EXCLUDED.description,
  last_updated = CURRENT_TIMESTAMP;

-- Add trigger to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_feature_matrix_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feature_matrix_timestamp
  BEFORE UPDATE ON feature_matrix_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_matrix_timestamp();
