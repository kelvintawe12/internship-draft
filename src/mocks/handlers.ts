import { http, HttpResponse } from 'msw';

export const handlers = [
  // Handler for POST /api/signup
  http.post('/api/signup', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string; role: 'user' | 'admin' };
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        user: { id: role === 'admin' ? 'admin123' : 'user123', name, email, role },
        token: role === 'admin' ? 'mock-admin-jwt-token' : 'mock-jwt-token',
        message: 'Signup successful. Please verify your email.',
      },
      { status: 200 }
    );
  }),

  // Handler for POST /api/login
  http.post('/api/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;

    if (email === 'john@example.com' && password === 'password123') {
      return HttpResponse.json(
        {
          user: { id: 'user123', name: 'John Doe', email, role: 'user' },
          token: 'mock-jwt-token',
        },
        { status: 200 }
      );
    }

    if (email === 'admin@example.com' && password === 'password123') {
      return HttpResponse.json(
        {
          user: { id: 'admin123', name: 'Admin User', email, role: 'admin' },
          token: 'mock-admin-jwt-token',
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Handler for POST /api/verify-email/:token
  http.post('/api/verify-email/:token', ({ params }) => {
    const { token } = params as { token: string };

    if (token === 'invalid-token') {
      return HttpResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        user: { id: 'user123', name: 'John Doe', email: 'user@example.com', role: 'user' },
        token: 'mock-jwt-token',
        message: 'Email verified successfully',
      },
      { status: 200 }
    );
  }),
];