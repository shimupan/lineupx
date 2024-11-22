//Use jest to test code!
import express from 'express';
import User from '../model/user.js';
import cloudinary from '../config/cloudinary.js';

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./model/user.js');

jest.mock('./path-to-user-model'); // Mock the User model

const app = express();
app.use(express.json());
app.use(router);

describe('GET /user/:id', () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   test('should return 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).get('/user/nonexistent-user').query({
         CurrentUser: 'testuser',
         Params: '',
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
   });

   test('should return default params for the same user', async () => {
      const mockUser = { username: 'testuser', ProfilePicture: 'profile.jpg' };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).get('/user/testuser').query({
         CurrentUser: 'testuser',
         Params: '',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith(
         { username: 'testuser' },
         'username ProfilePicture',
      );
   });

   test('should return additional params for the same user', async () => {
      const mockUser = {
         username: 'testuser',
         ProfilePicture: 'profile.jpg',
         email: 'test@example.com',
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).get('/user/testuser').query({
         CurrentUser: 'testuser',
         Params: 'email',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith(
         { username: 'testuser' },
         'username ProfilePicture email',
      );
   });

   test('should exclude restricted params for different user', async () => {
      const mockUser = {
         username: 'testuser',
         ProfilePicture: 'profile.jpg',
         comments: ['Nice post!'],
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).get('/user/testuser').query({
         CurrentUser: 'otheruser',
         Params: 'email comments password',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith(
         { username: 'testuser' },
         'username ProfilePicture comments',
      );
   });

   test('should return default params for unauthenticated user', async () => {
      const mockUser = { username: 'testuser', ProfilePicture: 'profile.jpg' };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).get('/user/testuser').query({
         CurrentUser: '',
         Params: '',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith(
         { username: 'testuser' },
         'username ProfilePicture',
      );
   });

   test('should handle server errors gracefully', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/user/testuser').query({
         CurrentUser: 'testuser',
         Params: '',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Server error' });
   });
});

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    test('should return 401 if accessToken or refreshToken is missing', async () => {
      const response = await request(app).post('/users').send({ accessToken: '' });
      expect(response.status).toBe(401);
      expect(response.text).toBe('Access Denied');
    });

    test('should return 404 if user is not found', async () => {
      const mockDecoded = { aud: '12345' };
      jest.spyOn(jwt, 'decode').mockReturnValue(mockDecoded);
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post('/users').send({
        accessToken: 'validToken',
        refreshToken: 'validRefresh',
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    test('should return user data if valid accessToken and user exists', async () => {
      const mockDecoded = { aud: '12345' };
      jest.spyOn(jwt, 'decode').mockReturnValue(mockDecoded);
      const mockUser = { _id: '12345', username: 'testuser' };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).post('/users').send({
        accessToken: 'validToken',
        refreshToken: 'validRefresh',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('GET /user/id/:id', () => {
    test('should return 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).get('/user/id/12345');

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    test('should return user if user exists', async () => {
      const mockUser = { _id: '12345', username: 'testuser' };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).get('/user/id/12345');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('GET /users/ids', () => {
    test('should return 404 if no users are found', async () => {
      User.find.mockResolvedValue([]);

      const response = await request(app).get('/users/ids').query({
        ids: '123,456',
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe('No users found');
    });

    test('should return 500 for server error', async () => {
      User.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/ids').query({
        ids: '123,456',
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });

    test('should return users if they exist', async () => {
      const mockUsers = [
        { _id: '123', username: 'user1' },
        { _id: '456', username: 'user2' },
      ];
      User.find.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users/ids').query({
        ids: '123,456',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('PATCH /user/:id', () => {
    test('should return 404 if user is not found', async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app).patch('/user/12345').send({
        username: 'updatedUser',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });

    test('should update user fields if user exists', async () => {
      const mockUser = { _id: '12345', username: 'testuser', save: jest.fn() };
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app).patch('/user/12345').send({
        username: 'updatedUser',
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated successfully');
      expect(response.body.user.username).toBe('updatedUser');
      expect(mockUser.username).toBe('updatedUser');
    });

    test('should handle server errors gracefully', async () => {
      User.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).patch('/user/12345').send({
        username: 'updatedUser',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /user', () => {
    test('should return 401 if role is not admin', async () => {
      const response = await request(app).post('/user').send({
        role: 'user',
      });

      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized');
    });

    test('should return 404 if no users are found', async () => {
      User.find.mockResolvedValue([]);

      const response = await request(app).post('/user').send({
        role: 'admin',
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Users not found');
    });

    test('should return all users if role is admin', async () => {
      const mockUsers = [
        { _id: '123', username: 'user1' },
        { _id: '456', username: 'user2' },
      ];
      User.find.mockResolvedValue(mockUsers);

      const response = await request(app).post('/user').send({
        role: 'admin',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });
  });
});

