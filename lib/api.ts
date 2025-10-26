const API_BASE = '/api';

interface ApiResponse<T = any> {
  message: string;
  status: boolean;
  result?: T;
}

export const api = {
  async login(email: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  async getMovies(token: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/movies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async createMovie(token: string, title: string, publishingYear: string, poster?: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ title, publishingYear, poster })
    });
    return res.json();
  },

  async updateMovie(token: string, id: number, title: string, publishingYear: string, poster?: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ title, publishingYear, poster })
    });
    return res.json();
  },

  async deleteMovie(token: string, id: number): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
