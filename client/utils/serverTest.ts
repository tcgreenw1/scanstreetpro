// Simple utility to test server connectivity

export const testServerConnectivity = async () => {
  try {
    console.log('🔍 Testing server connectivity...');
    
    // Test basic ping endpoint
    const pingResponse = await fetch('/api/ping');
    if (!pingResponse.ok) {
      throw new Error(`Ping failed: HTTP ${pingResponse.status}`);
    }
    
    const pingData = await pingResponse.json();
    console.log('✅ Server ping successful:', pingData.message);
    
    // Test plan tracking endpoints
    console.log('🔍 Testing plan tracking endpoints...');
    
    try {
      const allResponse = await fetch('/api/plan-tracking/all');
      if (allResponse.ok) {
        const allData = await allResponse.json();
        console.log('✅ Plan tracking /all endpoint works:', allData);
      } else {
        console.error(`❌ Plan tracking /all failed: HTTP ${allResponse.status} ${allResponse.statusText}`);
        const errorText = await allResponse.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Plan tracking /all network error:', error);
    }
    
    // Test feature matrix endpoints
    console.log('🔍 Testing feature matrix endpoints...');
    
    try {
      const matrixResponse = await fetch('/api/feature-matrix/plan/free');
      if (matrixResponse.ok) {
        const matrixData = await matrixResponse.json();
        console.log('✅ Feature matrix endpoint works:', matrixData);
      } else {
        console.error(`❌ Feature matrix failed: HTTP ${matrixResponse.status} ${matrixResponse.statusText}`);
        const errorText = await matrixResponse.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Feature matrix network error:', error);
    }
    
    return { success: true, message: 'Server connectivity test completed' };
    
  } catch (error) {
    console.error('❌ Server connectivity test failed:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).testServerConnectivity = testServerConnectivity;
  console.log('🔧 Server test utility available: testServerConnectivity()');
}
