// Simple test file to verify mock API functionality
import { mockApi } from '../lib/mockApi';

async function testMockApi() {
  console.log('Testing Mock API...');
  
  try {
    // Test registration
    console.log('Testing registration...');
    const registerResult = await mockApi.register('test@example.com', 'password123');
    console.log('Registration result:', registerResult);
    
    // Test login
    console.log('Testing login...');
    const loginResult = await mockApi.login('test@example.com', 'password123');
    console.log('Login result:', loginResult);
    
    // Test getMe
    console.log('Testing getMe...');
    const meResult = await mockApi.getMe();
    console.log('getMe result:', meResult);
    
    // Test getFiles
    console.log('Testing getFiles...');
    const filesResult = await mockApi.getFiles();
    console.log('getFiles result:', filesResult);
    
    console.log('✅ All mock API tests passed!');
    
  } catch (error) {
    console.error('❌ Mock API test failed:', error);
  }
}

// Export for use in development
export { testMockApi };