const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/tasks', require('./task'));

module.exports = router;
