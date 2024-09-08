const express = require('express');
const auth = require('./auth');

const router = express.Router();

router.use('/auth', auth);
router.use('/tasks', require('./task'));

module.exports = router;
