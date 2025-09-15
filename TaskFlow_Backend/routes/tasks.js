const express = require('express');
const Task = require('../models/Task');
const { authMiddleware } = require('./auth');
const router = express.Router();

router.use(authMiddleware);

// Create a new task
router.post('/', async (req, res) => {
  const { title, date, time/*, status*/ } = req.body;
  if (!title || !date || !time) return res.status(400).json({ error: 'Missing fields' });
  const dateObj = new Date(`${date}T${time}`);
  const dateString = dateObj.toDateString();

  const task = new Task({
    userId: req.userId,
    title,
    status: "Pending",
    date,
    time,
    dateString
  });
  await task.save();
  res.status(201).json(task);
});

// Get all the tasks for a user
router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Update task status/title/etc
router.put('/:id', async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

module.exports = router;
