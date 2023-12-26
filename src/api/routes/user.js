import express from 'express';
import User from '../model/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// single user login
router.get('/users', async (req, res) => {
   const accessToken = req.headers.accesstoken;
   const refreshToken = req.headers.refreshtoken;
   if (!accessToken || !refreshToken) {
      res.status(401).send('Access Denied');
   }

   const decoded = jwt.decode(accessToken);
   const user = await User.findOne({ _id: decoded.aud });

   if (!user) {
      res.status(404).send('User not found');
   } else {
      res.send(user);
   }
});

// getting a specific user by username
router.get('/user/:id', async (req, res) => {
   const username = req.params.id;
   const user = await User.findOne({ username: username });
   if (!user) {
      res.status(404).send('User not found');
   } else {
      res.send(user);
   }
});

// getting a specific user by id
router.get('/user/id/:id', async (req, res) => {
   const id = req.params.id;
   const user = await User.findOne({ _id: id });
   if (!user) {
      res.status(404).send('User not found');
   } else {
      res.send(user);
   }
});

// getting all users
router.post('/user', async (req, res) => {
   const { role } = req.body;
   if (role != 'admin') {
      return res.status(401).send('Unauthorized');
   }
   try {
      const users = await User.find();
      return res.send(users);
   } catch (error) {
      return res.status(404).send('Users not found');
   }
});

export default router;
