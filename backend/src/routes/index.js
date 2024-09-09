const express = require('express');
const { isAuthenticated } = require('../middlewares');

const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/tasks', isAuthenticated, require('./task'));

module.exports = router;
