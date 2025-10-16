// Mock API for demo purposes when backend is not available
const MOCK_FILES = [
  {
    id: "1",
    file_number: "FITT-2024-001",
    title: "Research Proposal - AI Technology",
    type: "Received",
    department: "IT",
    date: "2024-01-15",
    status: "In Progress",
    description: "AI research proposal for technology transfer",
    remarks: "Under review by technical committee",
    needs_return: false,
    storage_path: "/files/research-proposal.pdf",
    created_at: "2024-01-15T10:00:00Z",
    status_history: [
      {
        id: "1",
        status: "Pending",
        reason: "Initial submission",
        timestamp: "2024-01-15T10:00:00Z"
      },
      {
        id: "2", 
        status: "In Progress",
        reason: "Review started",
        timestamp: "2024-01-16T14:30:00Z"
      }
    ]
  },
  {
    id: "2",
    file_number: "FITT-2024-002",
    title: "Patent Application - Smart IoT Device",
    type: "Dispatched",
    department: "Operations",
    date: "2024-01-20",
    status: "Completed",
    description: "Patent filing for IoT device invention",
    remarks: "Successfully filed with patent office",
    needs_return: true,
    storage_path: "/files/patent-application.pdf",
    created_at: "2024-01-20T09:15:00Z",
    status_history: [
      {
        id: "3",
        status: "Pending",
        reason: "Initial submission",
        timestamp: "2024-01-20T09:15:00Z"
      },
      {
        id: "4",
        status: "Completed", 
        reason: "Filed successfully",
        timestamp: "2024-01-25T16:45:00Z"
      }
    ]
  }
];

const MOCK_DEPARTMENTS = [
  { id: "1", name: "IT", is_custom: false },
  { id: "2", name: "HR", is_custom: false },
  { id: "3", name: "Finance", is_custom: false },
  { id: "4", name: "Operations", is_custom: false }
];

// Helper function to simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Files
  getFiles: async () => { await delay(); return MOCK_FILES; },
  getFile: async (id: string) => { await delay(); return MOCK_FILES.find(f => f.id === id); },
  createFile: async (data: any) => { await delay(); return { id: Date.now().toString(), ...data }; },
  updateFile: async (id: string, data: any) => { await delay(); return { id, ...data }; },
  deleteFile: async (id: string) => { await delay(); return { success: true }; },
  
  // Departments
  getDepartments: async () => { await delay(); return MOCK_DEPARTMENTS; },
  
  // Status
  updateFileStatus: async (id: string, status: string, reason?: string) => {
    await delay();
    return { id: Date.now().toString(), file: id, status, reason, timestamp: new Date().toISOString() };
  },
    
  // Auth (mock)
  login: async (email: string, password: string) => {
    console.log('Mock login called with:', { email, password });
    await delay(500); // Simulate auth delay
    
    // Validate basic input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Mock successful login for any valid credentials
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefresh = 'mock-refresh-token-' + Date.now();
    localStorage.setItem('accessToken', mockToken);
    console.log('Mock login successful, token set');
    
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
    
    // Mock successful registration
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefresh = 'mock-refresh-token-' + Date.now();
    localStorage.setItem('accessToken', mockToken);
    console.log('Mock registration successful, token set');
    
    return { access: mockToken, refresh: mockRefresh };
  },
  
  getMe: async () => {
    await delay(200);
    return { id: 1, email: 'demo@example.com' };
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