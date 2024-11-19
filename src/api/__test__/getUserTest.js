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
      'username ProfilePicture'
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
      'username ProfilePicture email'
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
      'username ProfilePicture comments'
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
      'username ProfilePicture'
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
