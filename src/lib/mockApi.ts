// Mock API for demo purposes when backend is not available
// User-specific data storage using localStorage
const STORAGE_KEY = 'mockApi_userFiles';
const USER_KEY = 'mockApi_currentUser';

// Sample files templates for new users
const SAMPLE_FILE_TEMPLATES = [
  {
    file_number: "SAMPLE-001",
    title: "Welcome to Paper Trail Handler",
    type: "Internal",
    department: "IT",
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    description: "This is a sample file to demonstrate the system. You can edit or delete it.",
    remarks: "Sample file - feel free to modify or remove",
    needs_return: false,
    storage_path: "/files/welcome-sample.pdf"
  },
  {
    file_number: "DEMO-002", 
    title: "Demo Document - Getting Started",
    type: "Received",
    department: "Operations",
    date: new Date().toISOString().split('T')[0],
    status: "In Progress",
    description: "Another sample document to show file management features",
    remarks: "This demonstrates the file tracking workflow",
    needs_return: true,
    storage_path: "/files/demo-document.pdf"
  }
];

// Get current user identifier
function getCurrentUserId(): string {
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    return JSON.parse(user).id;
  }
  // Create new user if none exists
  const newUserId = 'user_' + Date.now();
  localStorage.setItem(USER_KEY, JSON.stringify({ id: newUserId, email: 'demo@example.com' }));
  return newUserId;
}

// Get user-specific files from localStorage
function getUserFiles(): any[] {
  const userId = getCurrentUserId();
  const allData = localStorage.getItem(STORAGE_KEY);
  if (!allData) return [];
  
  try {
    const parsed = JSON.parse(allData);
    return parsed[userId] || [];
  } catch {
    return [];
  }
}

// Save user-specific files to localStorage
function saveUserFiles(files: any[]): void {
  const userId = getCurrentUserId();
  const allData = localStorage.getItem(STORAGE_KEY);
  let parsed = {};
  
  try {
    parsed = allData ? JSON.parse(allData) : {};
  } catch {
    parsed = {};
  }
  
  parsed[userId] = files;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

// Initialize user with sample files if they don't have any
function initializeUserFiles(): any[] {
  let files = getUserFiles();
  
  if (files.length === 0) {
    // Create sample files for new user
    files = SAMPLE_FILE_TEMPLATES.map((template, index) => ({
      id: `file_${Date.now()}_${index}`,
      ...template,
      created_at: new Date().toISOString(),
      status_history: [{
        id: `status_${Date.now()}_${index}`,
        status: template.status,
        reason: "Initial status",
        timestamp: new Date().toISOString()
      }]
    }));
    
    saveUserFiles(files);
  }
  
  return files;
}

const MOCK_DEPARTMENTS = [
  { id: "1", name: "IT", is_custom: false },
  { id: "2", name: "HR", is_custom: false },
  { id: "3", name: "Finance", is_custom: false },
  { id: "4", name: "Operations", is_custom: false }
];

// Helper function to simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Clear user session data
export function clearMockUserData(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('accessToken');
  console.log('Mock user session cleared');
}

export const mockApi = {
  // Files - User-specific operations
  getFiles: async () => { 
    await delay(); 
    return initializeUserFiles(); 
  },
  
  getFile: async (id: string) => { 
    await delay(); 
    const files = getUserFiles();
    return files.find(f => f.id === id); 
  },
  
  createFile: async (data: any) => { 
    await delay(); 
    const files = getUserFiles();
    const newFile = {
      id: `file_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      status_history: [{
        id: `status_${Date.now()}`,
        status: data.status || 'Pending',
        reason: "Initial creation",
        timestamp: new Date().toISOString()
      }]
    };
    files.push(newFile);
    saveUserFiles(files);
    return newFile;
  },
  
  updateFile: async (id: string, data: any) => { 
    await delay(); 
    const files = getUserFiles();
    const fileIndex = files.findIndex(f => f.id === id);
    if (fileIndex !== -1) {
      files[fileIndex] = { ...files[fileIndex], ...data };
      saveUserFiles(files);
      return files[fileIndex];
    }
    return { id, ...data };
  },
  
  deleteFile: async (id: string) => { 
    await delay(); 
    const files = getUserFiles();
    const filteredFiles = files.filter(f => f.id !== id);
    saveUserFiles(filteredFiles);
    return { success: true }; 
  },
  
  // Departments
  getDepartments: async () => { await delay(); return MOCK_DEPARTMENTS; },
  
  // Status - Update user's specific file
  updateFileStatus: async (id: string, status: string, reason?: string) => {
    await delay();
    
    const files = getUserFiles();
    const fileIndex = files.findIndex(f => f.id === id);
    
    if (fileIndex !== -1) {
      // Update file status
      files[fileIndex].status = status;
      
      // Add to status history
      const statusEntry = {
        id: `status_${Date.now()}`,
        status,
        reason: reason || 'Status updated',
        timestamp: new Date().toISOString()
      };
      
      if (!files[fileIndex].status_history) {
        files[fileIndex].status_history = [];
      }
      files[fileIndex].status_history.push(statusEntry);
      
      saveUserFiles(files);
      return statusEntry;
    }
    
    // Fallback if file not found
    return { 
      id: Date.now().toString(), 
      file: id, 
      status, 
      reason: reason || 'Status updated', 
      timestamp: new Date().toISOString() 
    };
  },
    
  // Auth (mock)
  login: async (email: string, password: string) => {
    console.log('Mock login called with:', { email, password });
    await delay(500); // Simulate auth delay
    
    // Validate basic input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Create/update user session for login
    const userId = 'user_' + email.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now();
    const userData = { id: userId, email };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    // Mock successful login for any valid credentials
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefresh = 'mock-refresh-token-' + Date.now();
    localStorage.setItem('accessToken', mockToken);
    
    console.log('Mock login successful, user session:', userData);
    
    return { access: mockToken, refresh: mockRefresh };
  },
  
  register: async (email: string, password: string) => {
    console.log('Mock register called with:', { email, password });
    await delay(500); // Simulate registration delay
    
    // Validate basic input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Create new user session
    const userId = 'user_' + Date.now();
    const userData = { id: userId, email };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    // Mock successful registration
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefresh = 'mock-refresh-token-' + Date.now();
    localStorage.setItem('accessToken', mockToken);
    
    console.log('Mock registration successful, new user created:', userData);
    
    return { access: mockToken, refresh: mockRefresh };
  },
  
  getMe: async () => {
    await delay(200);
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    // Fallback user
    return { id: 'default_user', email: 'demo@example.com' };
  },
  
  // Upload
  uploadFile: async (file: File) => {
    await delay(800); // Simulate file upload
    return { storage_path: '/mock/path/' + file.name };
  },
  
  // Email
  sendEmail: async (data: any) => {
    await delay(600);
    return { success: true };
  }
};