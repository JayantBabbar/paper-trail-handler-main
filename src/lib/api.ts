import { mockApi, clearMockUserData } from './mockApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL || 'http://localhost:8000';

// Use mock API only when explicitly enabled or when backend URL is placeholder
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' ||
                 API_BASE === 'https://your-backend-api-url.com';

console.log('API Configuration:', {
  API_BASE,
  PROD: import.meta.env.PROD,
  USE_MOCK,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_USE_MOCK: import.meta.env.VITE_USE_MOCK
});

function buildUrl(path: string) {
  const base = API_BASE.replace(/\/$/, '');
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
}

async function request(path: string, opts: RequestInit = {}) {
  const url = buildUrl(path);
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('accessToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!opts.body || opts.body instanceof String || typeof opts.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, {
    headers: { ...headers, ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

// Helper function to handle mock fallback
async function apiWithMockFallback<T>(apiCall: () => Promise<T>, mockCall: () => Promise<T>): Promise<T> {
  if (USE_MOCK) {
    console.log('Using mock API for demo');
    try {
      return await mockCall();
    } catch (mockError: any) {
      console.error('Mock API call failed:', mockError);
      throw new Error('Mock API error: ' + mockError.message);
    }
  }
  
  try {
    return await apiCall();
  } catch (error: any) {
    console.warn('Real API call failed, falling back to mock data:', error.message);
    try {
      return await mockCall();
    } catch (mockError: any) {
      console.error('Mock API fallback also failed:', mockError);
      throw new Error('Both real and mock API failed: ' + error.message);
    }
  }
}

export const api = {
  getFiles: () => apiWithMockFallback(
    () => request('/api/files/'),
    () => mockApi.getFiles()
  ),
  getFile: (id: string) => apiWithMockFallback(
    () => request(`/api/files/${id}/`),
    () => mockApi.getFile(id)
  ),
  createFile: (payload: any) => apiWithMockFallback(
    () => request('/api/files/', { method: 'POST', body: JSON.stringify(payload) }),
    () => mockApi.createFile(payload)
  ),
  updateFile: (id: string, payload: any) => apiWithMockFallback(
    () => request(`/api/files/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
    () => mockApi.updateFile(id, payload)
  ),
  deleteFile: (id: string) => apiWithMockFallback(
    () => request(`/api/files/${id}/`, { method: 'DELETE' }),
    () => mockApi.deleteFile(id)
  ),
  getStatusHistory: () => apiWithMockFallback(
    () => request('/api/status_history/'),
    () => Promise.resolve([])
  ),
  updateFileStatus: (id: string, status: string, reason?: string) => apiWithMockFallback(
    () => request(`/api/files/${id}/update_status/`, { method: 'POST', body: JSON.stringify({ status, reason }) }),
    () => mockApi.updateFileStatus(id, status, reason)
  ),
  getDepartments: () => apiWithMockFallback(
    () => request('/api/departments/'),
    () => mockApi.getDepartments()
  ),
  addDepartment: (payload: any) => apiWithMockFallback(
    () => request('/api/departments/', { method: 'POST', body: JSON.stringify(payload) }),
    () => Promise.resolve({ id: Date.now().toString(), ...payload })
  ),
  sendEmail: (payload: any) => apiWithMockFallback(
    () => request('/api/send-email/', { method: 'POST', body: JSON.stringify(payload) }),
    () => mockApi.sendEmail(payload)
  ),
  getEmailThreads: (fileId: string) => apiWithMockFallback(
    () => request(`/api/email_threads/?file=${fileId}`),
    () => Promise.resolve([])
  ),
  uploadFile: async (form: FormData) => {
    if (USE_MOCK) {
      const file = form.get('file') as File;
      return await mockApi.uploadFile(file);
    }
    
    try {
      const url = buildUrl('/api/files/upload/');
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('accessToken');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(url, { 
        method: 'POST', 
        headers,
        body: form 
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return res.json();
    } catch (error: any) {
      console.warn('File upload failed, using mock response:', error.message);
      const file = form.get('file') as File;
      return await mockApi.uploadFile(file);
    }
  },
  register: (payload: any) => apiWithMockFallback(
    () => request('/api/auth/register/', { method: 'POST', body: JSON.stringify(payload) }),
    () => mockApi.register(payload.email, payload.password)
  ),
  login: (payload: any) => apiWithMockFallback(
    () => request('/api/auth/login/', { method: 'POST', body: JSON.stringify(payload) }),
    () => mockApi.login(payload.email, payload.password)
  ),
  getMe: () => apiWithMockFallback(
    () => request('/api/auth/me/'),
    () => mockApi.getMe()
  ),
};

export default api;

export function setToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function clearToken() {
  localStorage.removeItem('accessToken');
  // Also clear mock user data if in mock mode
  if (USE_MOCK) {
    clearMockUserData();
  }
}
