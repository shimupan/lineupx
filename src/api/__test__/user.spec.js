import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../setupServer';

const req = request(app);

const user1 = 'ooccupate';
const user2 = 'kagiriez';
const unknownUser = 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk';
const defaultParams = ['followers', 'saved', 'email'];

describe('Route: /user/:id -- Simulate an User Visiting Their Own Profile', () => {
   let res;

   beforeAll(async () => {
      res = await req.get(
         `/user/${user1}?CurrentUser=${user1}&Params=${defaultParams}`,
      );
   });

   it('Should return valid data from the database', () => {
      expect(res.status).toEqual(200);
      expect(res.body.username).toBe(user1);
   });

   it('Should return followers, saved, email', () => {
      expect(res.body.followers).toBeDefined();
      expect(res.body.saved).toBeDefined();
      expect(res.body.email).toBeDefined();
   });

   it('Should not have passwords and following', () => {
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('following');
   });
});

describe('Route: /user/:id -- Simulate an User Visiting Other Profile', () => {
   let res;

   beforeAll(async () => {
      res = await req.get(
         `/user/${user1}?CurrentUser=${user2}&Params=${defaultParams}`,
      );
   });

   it('Should return valid data from the database', () => {
      expect(res.status).toEqual(200);
      expect(res.body.username).toBe(user1);
   });

   it('Should return followers', () => {
      expect(res.body.followers).toBeDefined();
      expect(res.body).toHaveProperty('saved');
   });

   it('Should not have passwords, following, email', () => {
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('following');
      expect(res.body).not.toHaveProperty('email');
   });
});

describe('Route: /user/:id - Error Handling', () => {
   it('Should return 404 for a non-existent user', async () => {
      const res = await req.get(
         `/user/${unknownUser}?CurrentUser=${user1}&Params=${defaultParams}`,
      );
      expect(res.status).toEqual(404);
   });

   /*
   it('Should return 400 for missing parameters', async () => {
      const res = await req.get(`/user/${user1}`);
      expect(res.status).toEqual(400);
   });
   */

   it('Should return 400 for missing CurrentUser parameter', async () => {
      const res = await req.get(`/user/${user1}?Params=${defaultParams}`);
      expect(res.status).toEqual(400);
   });

   it('Should return 200 with limited data for another user without Params', async () => {
      const res = await req.get(`/user/${user2}?CurrentUser=${user1}`);
      expect(res.status).toEqual(200);
      expect(res.body.username).toBe(user2);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('email');
   });
});
