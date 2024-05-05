const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
         type: Date, required: true },
    status: {
         type: String, enum: ['present', 'absent'], required: true },
  },
{ timestamps: true });

const Attendance=mongoose.model('attendance',attendanceSchema);

module.exports=Attendance;
