import { setupWorker, rest } from 'msw';

const worker = setupWorker(
  rest.get('/api/user/settings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        language: 'en',
        timezone: 'Africa/Kigali',
        theme: 'light',
        notifications: { email: true, push: false, sms: false },
        twoFactorEnabled: false,
      })
    );
  }),

  rest.put('/api/user/settings', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.put('/api/user/password', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get('/api/notifications', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', message: 'Welcome to the app!', read: false, date: new Date().toISOString() },
        { id: '2', message: 'Your profile was updated.', read: true, date: new Date().toISOString() },
      ])
    );
  }),

  rest.post('/api/signup', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

export { worker };
