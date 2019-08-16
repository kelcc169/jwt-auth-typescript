import express from 'express';
const router = express.Router();

import User from '../models/user';
import { IUser } from '../models/user';
import jwt from 'jsonwebtoken';

router.post('/signup', (req, res) => {
  User.findOne({email: req.body.email}, (err, user: IUser) => {
    if (user) {
      res.json({type: 'error', message: 'Email already exists'})
    } else {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }, (err, user) => {
        if (err) {
          res.json({type: 'error', message: 'Database error while creating user'})
        } else {
          var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: '1d'
          });
          res.status(200).json({type: 'success', user: user.toObject(), token})
        }
      })
    }
  })
})

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, (err, user: IUser) => {
    if (!user) {
      res.json({type: 'error', message: 'Account not found'})
    } else {
      if (user.authenticated(req.body.password)) {
        var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        res.status(200).json({type: 'success', user: user.toObject(), token})
      } else {
        res.json({type: 'error', message: 'Authentication failure'})
      }
    }
  })
})

router.post('/me/from/token', (req, res) => {
  var token = req.body.token;
  if (!token) {
    res.json({type: 'error', message: 'You must submit a valid token'})
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user: IUser) => {
      if (err) {
        res.json({type: 'error', message: 'Invalid token. Please log in again.'})
      } else {
        User.findById(user._id, (err, user) => {
          if (err) {
            res.json({type: 'error', message: 'Database error during validation'})
          } else {
            res.json({type: 'success', user: user.toObject(), token})
          }
        })
      }
    })
  }
})

export default router;