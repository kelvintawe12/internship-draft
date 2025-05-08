import {msw} from 'msw';

const { rest } = msw;

export const handlers = [
  rest.post('/api/signup', (_req: any, res: any, ctx: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Signup successful. Please verify your email.',
      })
    );
  }),
  rest.post('/api/login', (req: any, res: any, ctx: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: { id: 'user123', email: req.body.email, role: 'user' },
        token: 'mock-jwt-token',
      })
    );
  }),
  rest.post('/api/verify-email', (req: any, res: any, ctx: any) => {
    const { token } = req.body;
    if (token === 'invalid-token') {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Invalid or expired token' })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        user: { id: 'user123', email: 'user@example.com', role: 'user' },
        token: 'mock-jwt-token',
      })
    );
  }),
];
