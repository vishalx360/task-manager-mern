const prisma = require('../db');

// Create a new task
const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error creating task' });
  }
};

// Get all tasks for the authenticated user
const getAllTasks = async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: 'Error retrieving tasks' });
  }
};

// Get a specific task by ID
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(400).json({ error: 'Error retrieving task' });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    let task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task = await prisma.task.update({
      where: { id },
      data: { title, description, status },
    });
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Error updating task' });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Error deleting task' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
