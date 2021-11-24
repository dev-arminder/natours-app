const express = require('express');
const router = express.Router();

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgetPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/', userController.getUsers);

router.post('/', userController.postUser);

router.get('/:id', userController.getUser);

router.patch('/:id', userController.patchUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
