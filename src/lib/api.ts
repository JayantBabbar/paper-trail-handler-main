const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL || 'http://localhost:8000';

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

export const api = {
  getFiles: () => request('/api/files/'),
  getFile: (id: string) => request(`/api/files/${id}/`),
  createFile: (payload: any) => request('/api/files/', { method: 'POST', body: JSON.stringify(payload) }),
  updateFile: (id: string, payload: any) => request(`/api/files/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteFile: (id: string) => request(`/api/files/${id}/`, { method: 'DELETE' }),
  getStatusHistory: () => request('/api/status_history/'),
  updateFileStatus: (id: string, status: string, reason?: string) => request(`/api/files/${id}/update_status/`, { method: 'POST', body: JSON.stringify({ status, reason }) }),
  getDepartments: () => request('/api/departments/'),
  addDepartment: (payload: any) => request('/api/departments/', { method: 'POST', body: JSON.stringify(payload) }),
  sendEmail: (payload: any) => request('/api/send-email/', { method: 'POST', body: JSON.stringify(payload) }),
  getEmailThreads: (fileId: string) => request(`/api/email_threads/?file=${fileId}`),
  uploadFile: async (form: FormData) => {
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
  },
  register: (payload: any) => request('/api/auth/register/', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/api/auth/me/'),
};

export default api;

export function setToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function clearToken() {
  localStorage.removeItem('accessToken');
}
