const BASE = import.meta.env.VITE_API_URL || '/api'

export const api = {
  get: (path) => fetch(`${BASE}${path}`).then(r => r.json()),
  post: (path, body) => fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json()),
}

export const getStats = () => api.get('/stats')
export const getAllRights = () => api.get('/rights')
export const getRightsByCategory = (cat) => api.get(`/rights/${cat}`)
export const searchRights = (q) => api.get(`/rights/search?q=${encodeURIComponent(q)}`)
export const fileReport = (data) => api.post('/reports', data)
export const getLanguages = () => api.get('/languages')
export const queryAssistant = (question, language = 'en') =>
  api.post('/assistant/query', { question, language })
