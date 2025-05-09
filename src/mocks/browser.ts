import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const worker = setupWorker(
  // Passthrough for non-API routes, external URLs, and static assets
  http.all('*', ({ request }) => {
    const url = new URL(request.url);
    if (url.protocol === 'chrome-extension:') {
      return new HttpResponse(null, { status: 200, statusText: 'Passthrough' });
    }
    if (url.pathname.match(/\.(woff2?|css|js|png|jpg|jpeg|svg|gif|ico)$/)) {
      return new HttpResponse(null, { status: 200, statusText: 'Passthrough' });
    }
    if (!url.pathname.startsWith('/api/')) {
      return new HttpResponse(null, { status: 200, statusText: 'Passthrough' });
    }
    return undefined;
  }),

  // Handler for GET /api/user/settings
  http.get('/api/user/settings', () => {
    return HttpResponse.json({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, Kigali, Rwanda',
      language: 'en',
      timezone: 'Africa/Kigali',
      preferredCurrency: 'RWF',
      notificationPreferences: { email: true, push: false, sms: false },
      twoFactorEnabled: false,
    });
  }),

  // Handler for PUT /api/user/settings
  http.put('/api/user/settings', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  // Handler for PUT /api/user/password
  http.put('/api/user/password', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  // Handler for POST /api/signup
  http.post('/api/signup', async ({ request }) => {
    interface SignupRequestBody {
      name: string;
      email: string;
      password: string;
      role: 'user' | 'admin';
    }

    const { name, email, password, role } = (await request.json()) as SignupRequestBody;

    if (!name || !email || !password || !role) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'user' && role !== 'admin') {
      return HttpResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    return HttpResponse.json({
      user: {
        id: role === 'admin' ? 'admin-' + Math.random().toString(36).substr(2, 9) : 'user-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      },
      token: role === 'admin' ? 'mock-admin-jwt-token' : 'mock-jwt-token',
      message: 'Signup successful. Please verify your email.',
    }, { status: 201 });
  }),

  // Handler for POST /api/login
  http.post('/api/login', async ({ request }) => {
    interface LoginRequestBody {
      email: string;
      password: string;
    }

    const { email, password } = (await request.json()) as LoginRequestBody;

    if (!email || !password) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (email === 'john@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: {
          id: 'user123',
          name: 'John Doe',
          email,
          role: 'user',
        },
        token: 'mock-jwt-token',
      });
    }

    if (email === 'admin@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: {
          id: 'admin123',
          name: 'Admin User',
          email,
          role: 'admin',
        },
        token: 'mock-admin-jwt-token',
      });
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // Handler for POST /api/logout
  http.post('/api/logout', () => {
    return HttpResponse.json(null, { status: 200 });
  }),

  // Handler for POST /api/verify-email/:token
  http.post('/api/verify-email/:token', ({ params }) => {
    const { token } = params as { token: string };
    if (token === 'invalid-token') {
      return HttpResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    return HttpResponse.json({ message: 'Email verified' });
  }),

  // Handler for POST /api/forgot-password
  http.post('/api/forgot-password', async ({ request }) => {
    interface ForgotPasswordRequestBody {
      email: string;
    }

    const { email } = (await request.json()) as ForgotPasswordRequestBody;

    if (!email) {
      return HttpResponse.json({ error: 'Email required' }, { status: 400 });
    }

    return HttpResponse.json({ message: 'Reset link sent' });
  }),

  // Handler for GET and PUT /api/user/profile
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Software developer and coffee enthusiast. Passionate about building user-friendly applications.',
      website: 'https://johndoe.com',
      socialLinks: {
        twitter: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
      },
      joinedDate: '2023-01-01T00:00:00Z',
    });
  }),
  http.put('/api/user/profile', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  // Handler for GET /api/user/activity
  http.get('/api/user/activity', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const allActivities = [
      {
        id: '1',
        description: 'Logged in from Chrome on Windows',
        date: new Date().toISOString(),
        type: 'login',
      },
      {
        id: '2',
        description: 'Updated profile information',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'update',
      },
      {
        id: '3',
        description: 'Posted a comment on order #123',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        type: 'comment',
      },
      {
        id: '4',
        description: 'Logged in from Safari on iPhone',
        date: new Date().toISOString(),
        type: 'login',
      },
      {
        id: '5',
        description: 'Updated security settings',
        date: new Date().toISOString(),
        type: 'update',
      },
    ];

    let filteredActivities = allActivities;

    if (search) {
      filteredActivities = filteredActivities.filter((a) => a.description.toLowerCase().includes(search));
    }

    if (dateFrom) {
      filteredActivities = filteredActivities.filter((a) => new Date(a.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filteredActivities = filteredActivities.filter((a) => new Date(a.date) <= new Date(dateTo));
    }

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedActivities = filteredActivities.slice(start, start + pageSize);

    return HttpResponse.json(paginatedActivities);
  }),

  // Handler for PATCH /api/notifications/:id
  http.patch('/api/notifications/:id', ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({ message: `Notification ${id} marked as read` });
  }),

  // Handler for GET /api/notifications
  http.get('/api/notifications', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const allNotifications = [
      {
        id: '1',
        message: 'Welcome to the app! Get started by updating your profile.',
        date: new Date().toISOString(),
        read: false,
        type: 'info',
        priority: 'low',
      },
      {
        id: '2',
        message: 'Your profile was updated successfully.',
        date: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        type: 'info',
        priority: 'medium',
      },
      {
        id: '3',
        message: 'Payment of 999,999 RWF is pending.',
        date: new Date().toISOString(),
        read: false,
        type: 'warning',
        priority: 'high',
      },
      {
        id: '4',
        message: 'Server maintenance scheduled for tonight.',
        date: new Date().toISOString(),
        read: false,
        type: 'warning',
        priority: 'medium',
      },
      {
        id: '5',
        message: 'Failed to process your order. Please try again.',
        date: new Date().toISOString(),
        read: false,
        type: 'error',
        priority: 'high',
      },
    ];

    let filteredNotifications = allNotifications;

    if (status === 'read') {
      filteredNotifications = filteredNotifications.filter((n) => n.read);
    } else if (status === 'unread') {
      filteredNotifications = filteredNotifications.filter((n) => !n.read);
    }

    if (search) {
      filteredNotifications = filteredNotifications.filter((n) => n.message.toLowerCase().includes(search));
    }

    if (dateFrom) {
      filteredNotifications = filteredNotifications.filter((n) => new Date(n.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filteredNotifications = filteredNotifications.filter((n) => new Date(n.date) <= new Date(dateTo));
    }

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedNotifications = filteredNotifications.slice(start, start + pageSize);

    return HttpResponse.json(paginatedNotifications);
  }),

  // Handler for DELETE /api/notifications
  http.delete('/api/notifications', () => {
    return HttpResponse.json({ message: 'All notifications cleared' }, { status: 200 });
  }),

  // Handler for GET /api/orders
  http.get('/api/orders', () => {
    return HttpResponse.json([
      {
        id: '1',
        date: new Date().toISOString(),
        total: 999999,
        status: 'pending',
        items: [{ name: 'Laptop', quantity: 1, price: 999999 }],
      },
      {
        id: '2',
        date: new Date().toISOString(),
        total: 499998,
        status: 'shipped',
        items: [{ name: 'Phone', quantity: 2, price: 249999 }],
      },
      {
        id: '3',
        date: new Date().toISOString(),
        total: 1499997,
        status: 'delivered',
        items: [{ name: 'Tablet', quantity: 3, price: 499999 }],
      },
    ]);
  }),

  // Handler for GET /api/user/security
  http.get('/api/user/security', () => {
    return HttpResponse.json({
      twoFactorEnabled: false,
      loginAlertsEnabled: true,
    });
  }),

  // Handler for POST /api/user/security/two-factor
  http.post('/api/user/security/two-factor', async ({ request }) => {
    interface TwoFactorRequestBody {
      enabled: boolean;
    }
    const { enabled } = (await request.json()) as TwoFactorRequestBody;
    return HttpResponse.json({ twoFactorEnabled: enabled }, { status: 200 });
  }),

  // Handler for POST /api/user/security/login-alerts
  http.post('/api/user/security/login-alerts', async ({ request }) => {
    interface LoginAlertsRequestBody {
      enabled: boolean;
    }
    const { enabled } = (await request.json()) as LoginAlertsRequestBody;
    return HttpResponse.json({ loginAlertsEnabled: enabled }, { status: 200 });
  }),

  // Handler for GET /api/user/sessions
  http.get('/api/user/sessions', () => {
    return HttpResponse.json([
      {
        id: 'session1',
        device: 'Chrome on Windows',
        ip: '192.168.1.1',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'session2',
        device: 'Safari on iPhone',
        ip: '192.168.1.2',
        lastActive: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  }),

  // Handler for DELETE /api/user/sessions/:id
  http.delete('/api/user/sessions/:id', ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({ message: `Session ${id} logged out` }, { status: 200 });
  }),

  // Handler for GET /api/user/billing
  http.get('/api/user/billing', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const allInvoices = [
      {
        id: 'INV001',
        date: new Date().toISOString(),
        amount: 999999,
        status: 'pending',
      },
      {
        id: 'INV002',
        date: new Date(Date.now() - 86400000).toISOString(),
        amount: 499998,
        status: 'paid',
      },
      {
        id: 'INV003',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        amount: 1499997,
        status: 'failed',
      },
      {
        id: 'INV004',
        date: new Date().toISOString(),
        amount: 249999,
        status: 'pending',
      },
      {
        id: 'INV005',
        date: new Date().toISOString(),
        amount: 799999,
        status: 'paid',
      },
    ];

    let filteredInvoices = allInvoices;

    if (status && status !== 'all') {
      filteredInvoices = filteredInvoices.filter((i) => i.status === status);
    }

    if (search) {
      filteredInvoices = filteredInvoices.filter((i) => i.id.toLowerCase().includes(search));
    }

    if (dateFrom) {
      filteredInvoices = filteredInvoices.filter((i) => new Date(i.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filteredInvoices = filteredInvoices.filter((i) => new Date(i.date) <= new Date(dateTo));
    }

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedInvoices = filteredInvoices.slice(start, start + pageSize);

    return HttpResponse.json(paginatedInvoices);
  }),

  // Handler for GET /api/user/billing/payment-methods
  http.get('/api/user/billing/payment-methods', () => {
    return HttpResponse.json([
      {
        id: 'pm1',
        type: 'card',
        lastFour: '1234',
        expiry: '12/25',
      },
      {
        id: 'pm2',
        type: 'mobile',
        lastFour: '5678',
      },
    ]);
  }),

  // Handler for GET /api/user/billing/invoices/:id/download
  http.get('/api/user/billing/invoices/:id/download', ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({ message: `Invoice ${id} downloaded` }, { status: 200 });
  }),

  // Handler for GET /api/user/support/tickets
  http.get('/api/user/support/tickets', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const allTickets = [
      {
        id: 'TCK001',
        subject: 'Issue with payment processing',
        status: 'open',
        date: new Date().toISOString(),
        description: 'Unable to process payment for order #123.',
      },
      {
        id: 'TCK002',
        subject: 'Account login problem',
        status: 'pending',
        date: new Date(Date.now() - 86400000).toISOString(),
        description: 'Getting invalid credentials error despite correct password.',
      },
      {
        id: 'TCK003',
        subject: 'Order delivery inquiry',
        status: 'closed',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        description: 'When will my order #456 be delivered?',
      },
      {
        id: 'TCK004',
        subject: 'Feature request',
        status: 'open',
        date: new Date().toISOString(),
        description: 'Please add support for dark mode.',
      },
      {
        id: 'TCK005',
        subject: 'Billing discrepancy',
        status: 'pending',
        date: new Date().toISOString(),
        description: 'Charged incorrect amount for invoice INV002.',
      },
    ];

    let filteredTickets = allTickets;

    if (status && status !== 'all') {
      filteredTickets = filteredTickets.filter((t) => t.status === status);
    }

    if (search) {
      filteredTickets = filteredTickets.filter((t) => t.subject.toLowerCase().includes(search));
    }

    if (dateFrom) {
      filteredTickets = filteredTickets.filter((t) => new Date(t.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filteredTickets = filteredTickets.filter((t) => new Date(t.date) <= new Date(dateTo));
    }

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedTickets = filteredTickets.slice(start, start + pageSize);

    return HttpResponse.json(paginatedTickets);
  }),

  // Handler for POST /api/user/support/tickets
  http.post('/api/user/support/tickets', async ({ request }) => {
    interface SupportTicketRequestBody {
      subject: string;
      description: string;
    }
    const { subject, description } = (await request.json()) as SupportTicketRequestBody;
    return HttpResponse.json(
      {
        id: `TCK${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        subject,
        description,
        status: 'open',
        date: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Handler for GET /api/user/messages
  http.get('/api/user/messages', ({ request }) => {
    const url = new URL(request.url);
    const sender = url.searchParams.get('sender')?.toLowerCase() || '';
    const subject = url.searchParams.get('subject')?.toLowerCase() || '';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const allMessages = [
      {
        id: 'MSG001',
        from: 'support@company.com',
        subject: 'Welcome to Our Platform',
        date: new Date().toISOString(),
        content: 'Thank you for joining our platform! Let us know if you need assistance.',
        recipientType: 'user',
      },
      {
        id: 'MSG002',
        from: 'admin@company.com',
        subject: 'Account Verification',
        date: new Date(Date.now() - 86400000).toISOString(),
        content: 'Please verify your account to access all features.',
        recipientType: 'user',
      },
      {
        id: 'MSG003',
        from: 'support@company.com',
        subject: 'Order Confirmation',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        content: 'Your order #123 has been confirmed.',
        recipientType: 'user',
      },
      {
        id: 'MSG004',
        from: 'john@example.com',
        subject: 'Support Request',
        date: new Date().toISOString(),
        content: 'I need help with my recent order.',
        recipientType: 'support',
      },
      {
        id: 'MSG005',
        from: 'john@example.com',
        subject: 'Feature Suggestion',
        date: new Date().toISOString(),
        content: 'Please consider adding a dark mode.',
        recipientType: 'admin',
      },
    ];

    let filteredMessages = allMessages;

    if (sender) {
      filteredMessages = filteredMessages.filter((m) => m.from.toLowerCase().includes(sender));
    }

    if (subject) {
      filteredMessages = filteredMessages.filter((m) => m.subject.toLowerCase().includes(subject));
    }

    if (dateFrom) {
      filteredMessages = filteredMessages.filter((m) => new Date(m.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filteredMessages = filteredMessages.filter((m) => new Date(m.date) <= new Date(dateTo));
    }

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedMessages = filteredMessages.slice(start, start + pageSize);

    return HttpResponse.json(paginatedMessages);
  }),

  // Handler for POST /api/user/messages
  http.post('/api/user/messages', async ({ request }) => {
    interface MessageRequestBody {
      recipientType: string;
      subject: string;
      content: string;
    }
    const { recipientType, subject, content } = (await request.json()) as MessageRequestBody;
    return HttpResponse.json(
      {
        id: `MSG${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        from: 'john@example.com',
        subject,
        content,
        date: new Date().toISOString(),
        recipientType,
      },
      { status: 201 }
    );
  })
);

export { worker };