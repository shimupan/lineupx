//Use jest to test code!
import express from 'express';
import User from '../model/user.js';
import cloudinary from '../config/cloudinary.js';

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./model/user.js');

jest.mock('./model/user.js'); // Mock the User model

const app = express();
app.use(express.json());
app.use(router);

describe('/user/:userId/viewed-post API', () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   test('should return 404 if user does not exist', async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app)
         .post('/user/123/viewed-post')
         .send({ postId: '456' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
   });

   test('should return 200 if the post was already viewed last', async () => {
      const mockUser = {
         _id: new mongoose.Types.ObjectId(),
         viewed: [new mongoose.Types.ObjectId('507f191e810c19729de860ea')],
         save: jest.fn(),
      };
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
         .post(`/user/${mockUser._id}/viewed-post`)
         .send({ postId: '507f191e810c19729de860ea' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
         message: 'Post already viewed right before!',
      });
   });

   test('should move a re-viewed post to the front', async () => {
      const mockUser = {
         _id: new mongoose.Types.ObjectId(),
         viewed: [
            new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
            new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
         ],
         save: jest.fn(),
      };
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
         .post(`/user/${mockUser._id}/viewed-post`)
         .send({ postId: '507f191e810c19729de860ea' });

      expect(mockUser.viewed).toEqual([
         new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
         new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
      ]);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
         message: 'Viewed Post added successfully',
      });
   });

   test('should add a new post to the viewed array', async () => {
      const mockUser = {
         _id: new mongoose.Types.ObjectId(),
         viewed: [new mongoose.Types.ObjectId('507f191e810c19729de860eb')],
         save: jest.fn(),
      };
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
         .post(`/user/${mockUser._id}/viewed-post`)
         .send({ postId: '507f191e810c19729de860ea' });

      expect(mockUser.viewed).toEqual([
         new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
         new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
      ]);
      expect(mockUser.save).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
         message: 'Viewed Post added successfully',
      });
   });

   test('should cap the viewed array to maxViewedPostSpace', async () => {
      const maxViewedPostSpace = 2;
      const mockUser = {
         _id: new mongoose.Types.ObjectId(),
         viewed: [
            new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
            new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
         ],
         save: jest.fn(),
      };
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
         .post(`/user/${mockUser._id}/viewed-post`)
         .send({ postId: '507f191e810c19729de860ec' });

      expect(mockUser.viewed).toHaveLength(maxViewedPostSpace);
      expect(mockUser.viewed).toEqual([
         new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
         new mongoose.Types.ObjectId('507f191e810c19729de860ec'),
      ]);
      expect(mockUser.save).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
         message: 'Viewed Post added successfully',
      });
   });

   test('should return 500 on server error', async () => {
      User.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
         .post('/user/123/viewed-post')
         .send({ postId: '456' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Server error' });
   });
});
