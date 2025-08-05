// Simple utility to initialize the feature matrix database
// This can be called from the browser console or a test component

export const initializeFeatureMatrix = async () => {
  try {
    console.log('🚀 Initializing feature matrix database...');
    
    const response = await fetch('/api/feature-matrix/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('✅ Feature matrix initialized successfully!');
        return { success: true, message: 'Feature matrix initialized' };
      } else {
        console.error('❌ Feature matrix initialization failed:', result.error);
        return { success: false, error: result.error };
      }
    } else {
      const error = `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ Feature matrix initialization failed:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('❌ Network error during feature matrix initialization:', error);
    return { success: false, error: error?.message || 'Network error' };
  }
};

export const testFeatureMatrix = async (planType: string = 'free') => {
  try {
    console.log(`🧪 Testing feature matrix for plan: ${planType}`);

    const response = await fetch(`/api/feature-matrix/plan/${planType}`);

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('✅ Feature matrix data:', result.data);

        const { matrix } = result.data;
        const dashboardFeatures = Object.keys(matrix.dashboard).length;
        const navFeatures = Object.keys(matrix.navMenu).length;

        console.log(`📊 Plan "${planType}" has ${dashboardFeatures} dashboard features and ${navFeatures} nav features`);

        // Log some examples
        console.log('🎛️ Dashboard features:', Object.entries(matrix.dashboard).slice(0, 3));
        console.log('🧭 Nav features:', Object.entries(matrix.navMenu).slice(0, 3));

        return { success: true, data: result.data };
      } else {
        console.error('❌ API error:', result.error);
        return { success: false, error: result.error };
      }
    } else {
      const error = `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ Feature matrix test failed:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('❌ Network error during feature matrix test:', error);
    return { success: false, error: error?.message || 'Network error' };
  }
};

export const testPlanTracking = async () => {
  try {
    console.log('🧪 Testing plan tracking API...');

    // Test basic connectivity first
    const pingResponse = await fetch('/api/plan-tracking/all');

    if (!pingResponse.ok) {
      const error = `HTTP ${pingResponse.status}: ${pingResponse.statusText}`;
      console.error('❌ Plan tracking API not responding:', error);
      return { success: false, error };
    }

    const result = await pingResponse.json();
    if (result.success) {
      console.log(`✅ Plan tracking API working. Found ${result.data.length} tracking entries`);
      if (result.message) {
        console.log(`ℹ️ ${result.message}`);
      }
      return { success: true, data: result.data };
    } else {
      console.error('❌ Plan tracking API error:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Network error during plan tracking test:', error);
    return { success: false, error: error?.message || 'Network error' };
  }
};

// Make these functions available globally for easy testing
if (typeof window !== 'undefined') {
  (window as any).initFeatureMatrix = initializeFeatureMatrix;
  (window as any).testFeatureMatrix = testFeatureMatrix;
  
  console.log('🔧 Feature matrix utilities available:');
  console.log('   • initFeatureMatrix() - Initialize the database');
  console.log('   • testFeatureMatrix("plan") - Test feature matrix for a plan');
}
