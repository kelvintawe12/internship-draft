import { setupWorker } from 'msw/browser';
import { http } from 'msw';

const worker = setupWorker(
  // Handler for GET /api/user/settings
  http.get('/api/user/settings', () => {
    return new Response(
      JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        language: 'en',
        timezone: 'Africa/Kigali',
        theme: 'light',
        notifications: { email: true, push: false, sms: false },
        twoFactorEnabled: false,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for PUT /api/user/settings
  http.put('/api/user/settings', () => {
    return new Response(null, { status: 200 });
  }),

  // Handler for PUT /api/user/password
  http.put('/api/user/password', () => {
    return new Response(null, { status: 200 });
  }),

  // Handler for POST /api/signup
  http.post('/api/signup', async ({ request }) => {
    interface SignupRequestBody {
      name: string;
      email: string;
      password: string;
      role: string;
    }

    const { name, email, password, role } = (await request.json()) as SignupRequestBody;

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
        },
        token: 'mock-jwt-token-signup',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for POST /api/login
  http.post('/api/login', async ({ request }) => {
    interface LoginRequestBody {
      email: string;
      password: string;
    }

    const { email, password } = (await request.json()) as LoginRequestBody;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: 'user123',
          name: 'John Doe',
          email,
          role: email.includes('admin') ? 'admin' : 'user',
        },
        token: 'mock-jwt-token-login',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for POST /api/logout
  http.post('/api/logout', () => {
    return new Response(null, { status: 200 });
  }),

  // Handler for POST /api/verify-email/:token
  http.post('/api/verify-email/:token', () => {
    return new Response(
      JSON.stringify({ message: 'Email verified' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for POST /api/forgot-password
  http.post('/api/forgot-password', async ({ request }) => {
    interface ForgotPasswordRequestBody {
      email: string;
    }

    const { email } = (await request.json()) as ForgotPasswordRequestBody;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Reset link sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for GET /api/user/profile
  http.get('/api/user/profile', () => {
    return new Response(
      JSON.stringify({
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Software developer and coffee enthusiast',
        joinedDate: '2023-01-01T00:00:00Z',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for GET /api/user/activity
  http.get('/api/user/activity', () => {
    return new Response(
      JSON.stringify([
        { id: '1', action: 'Logged in', timestamp: new Date().toISOString() },
        { id: '2', action: 'Updated profile', timestamp: new Date().toISOString() },
        { id: '3', action: 'Posted a comment', timestamp: new Date().toISOString() },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for PATCH /api/notifications/:id
  http.patch('/api/notifications/:id', ({ params }) => {
    const { id } = params;
    return new Response(
      JSON.stringify({ message: `Notification ${id} marked as read` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for GET /api/orders
  http.get('/api/orders', () => {
    return new Response(
      JSON.stringify([
        {
          id: '1',
          date: new Date().toISOString(),
          total: 999.99,
          status: 'pending',
          items: [{ name: 'Laptop', quantity: 1, price: 999.99 }],
        },
        {
          id: '2',
          date: new Date().toISOString(),
          total: 499.98,
          status: 'shipped',
          items: [{ name: 'Phone', quantity: 2, price: 249.99 }],
        },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Handler for GET /api/notifications
  http.get('/api/notifications', () => {
    return new Response(
      JSON.stringify([
        { id: '1', message: 'Welcome to the app!', read: false, date: new Date().toISOString() },
        { id: '2', message: 'Your profile was updated.', read: true, date: new Date().toISOString() },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  })
);

export { worker };