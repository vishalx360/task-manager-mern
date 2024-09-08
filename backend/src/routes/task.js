const express = require('express');
const taskController = require('../controller/task');
const { isAuthenticated } = require('../middlewares');

const router = express.Router();

router.post('/tasks', isAuthenticated, taskController.createTask);
router.get('/tasks', isAuthenticated, taskController.getAllTasks);
router.get('/tasks/:id', isAuthenticated, taskController.getTaskById);
router.put('/tasks/:id', isAuthenticated, taskController.updateTask);
router.delete('/tasks/:id', isAuthenticated, taskController.deleteTask);

module.exports = router;
