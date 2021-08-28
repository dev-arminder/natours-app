const express = require('express');
const router = express.Router();

const userController = require('./../controllers/userController');

router.get('/', userController.getUsers);

router.post('/', userController.postUser);

router.get('/:id', userController.getUser);

router.patch('/:id', userController.patchUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
