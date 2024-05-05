const mongoose = require('mongoose');

const leaveApprovalSchema = new mongoose.Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     userName:{
          type:String,
          required:true
     },   
    startDate: {
         type: Date, required: true },
    endDate: {
         type: Date, required: true },
    status: {
         type: String, enum: ['pending', 'approved', 'rejected'], default:'pending' },
  }, 
  { timestamps: true });

  const LeaveApproval = mongoose.model('LeaveApproval', leaveApprovalSchema);

  module.exports=LeaveApproval