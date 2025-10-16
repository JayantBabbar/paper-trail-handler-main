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

export const mockApi = {
  // Files
  getFiles: () => Promise.resolve(MOCK_FILES),
  getFile: (id: string) => Promise.resolve(MOCK_FILES.find(f => f.id === id)),
  createFile: (data: any) => Promise.resolve({ id: Date.now().toString(), ...data }),
  updateFile: (id: string, data: any) => Promise.resolve({ id, ...data }),
  deleteFile: (id: string) => Promise.resolve({ success: true }),
  
  // Departments
  getDepartments: () => Promise.resolve(MOCK_DEPARTMENTS),
  
  // Status
  updateFileStatus: (id: string, status: string, reason?: string) => 
    Promise.resolve({ id: Date.now().toString(), file: id, status, reason, timestamp: new Date().toISOString() }),
    
  // Auth (mock)
  login: (email: string, password: string) => {
    // Mock successful login for any credentials
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefresh = 'mock-refresh-token-' + Date.now();
    localStorage.setItem('accessToken', mockToken);
    return Promise.resolve({ access: mockToken, refresh: mockRefresh });
  },
  register: (email: string, password: string) => {
    // Mock successful registration
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefresh = 'mock-refresh-token-' + Date.now();
    localStorage.setItem('accessToken', mockToken);
    return Promise.resolve({ access: mockToken, refresh: mockRefresh });
  },
  getMe: () => Promise.resolve({ id: 1, email: 'demo@example.com' }),
  
  // Upload
  uploadFile: (file: File) => Promise.resolve({ storage_path: '/mock/path/' + file.name }),
  
  // Email
  sendEmail: (data: any) => Promise.resolve({ success: true })
};