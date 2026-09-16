// checking if it works will remove it and add a better one



// the dhl backend runs on :
const BASE_URL_URL = 'http://localhost:2026/api';


// ERRORS
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  // Try to parse JSON even if response is an error
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {

    // Use backend message if available, else fall back
    throw new Error(
      data.message || data.error || `Request failed (${response.status})`
    );
  }

  return data;
}


// AUTH — login, register, change password

export const authAPI = {

  login: (email, password, role) =>
    request('/auth/login', {

      method: 'POST',
      body: JSON.stringify({ email, password, role })
    }),

  register: (payload) =>
    request('/auth/register', {

      method: 'POST',
      body: JSON.stringify(payload)
    }),

  changePassword: (userId, currentPassword, newPassword) =>
    request('/auth/change-password', {

      method: 'POST',
      body: JSON.stringify({ userId, currentPassword, newPassword })
    })
};


// HOME 

export const homeAPI = {
  getHomeData: () => request('/home')
};


// DASHBOARDS — one per role
export const dashAPI = {

  getStudent: (userId) => request(`/dashboards/student/${userId}`),

  getAdmin: () => request('/dashboards/admin'),

  getResManager: () => request('/dashboards/res-manager'),

  getProvider: (providerId) => request(`/dashboards/provider/${providerId}`)
};


// ROLES

export const roleMap = {
  student: 'student',
  provider: 'service_provider',
  admin: 'admin',
  resmanager: 'res_manager'
};



// used for redirects
export const dashboardRoutes = {

  student: '/student-dashboard',
  service_provider: '/provider-dashboard',
  admin: '/admin-dashboard',
  res_manager: '/resmanager-dashboard'
};



// SESSION HELPERS — save/load user after login
export const session = {

  save: (user) => {

    localStorage.setItem('user', JSON.stringify(user));
  },

  get: () => {

    const raw = localStorage.getItem('user');

    return raw ? JSON.parse(raw) : null;

  },

  clear: () => {

    localStorage.removeItem('user');
  }
};