const BASE_URL = process.env.REACT_APP_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur réseau');
  }
  return data;
}

export const menuAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/menu-items${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/menu-items/${id}`),
  create: (item) =>
    request('/menu-items', { method: 'POST', body: JSON.stringify(item) }),
  update: (id, item) =>
    request(`/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  delete: (id) => request(`/menu-items/${id}`, { method: 'DELETE' }),
};
