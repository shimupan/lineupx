import request from 'supertest';
import app from '../server.js';

describe('Testing Get User', () => {
   it('should return data from the database', async () => {
      const res = await request(app).get('/user/ooccupate');
      expect(res.body.username).toBe('ooccupate');
   });
});
