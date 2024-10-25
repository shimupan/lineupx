import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../setupServer';

const req = request(app);

describe('Testing Home Page', () => {
   it('Should return ', async () => {
      const res = await req.get('/');
      expect(res.status).toBe(200);
      expect(res.body.data).toBe('server is running');
   });
});
