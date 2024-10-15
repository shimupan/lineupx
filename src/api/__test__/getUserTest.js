// Use jest to test code!
import request from 'supertest';
import server from '../server.js'; 

describe('Testing Get User', () => {
  it('should return data from the database', async () => {
    const res = await request(server).get('/user/ooccupate');
    expect(res.username).toBe("ooccupate");
  });
});
