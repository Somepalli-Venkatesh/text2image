const API_BASE = '/api'

export async function apiPost(endpoint, data, formData = false) {
  const options = {
    method: 'POST',
    credentials: 'include'
  }
  if (formData) {
    options.body = data
  } else {
    options.headers = {
      'Content-Type': 'application/json'
    }
    options.body = JSON.stringify(data)
  }
  const res = await fetch(`${API_BASE}${endpoint}`, options)
  return res.json()
}

export async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, { credentials: 'include' })
  return res.json()
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE', credentials: 'include' })
  return res.json()
}
