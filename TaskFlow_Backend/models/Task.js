const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // "Pending", "Completed", etc.
  date: { type: String, required: true },       // 'YYYY-MM-DD'
  time: { type: String, required: true },       // 'HH:mm'
  dateString: { type: String, required: true }, // e.g. 'Sun Sep 14 2025'
});
module.exports = mongoose.model('Task', TaskSchema);
