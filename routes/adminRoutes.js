const express = require('express');
const router = express.Router();
const authorization = require('../utils/authorization');
const adminController = require('../controllers/adminController');
const verify = require('./../utils/verify');

router.get('/login', adminController.showloginform);
router.post('/login', adminController.adminLogin);
router.get('/allusers',verify,authorization.authorization('admin'), adminController.viewAllUserRecords);
router.post('/attendance/edit',verify,authorization.authorization('admin'), adminController.editUserAttendance);
router.post('/attendance/add',verify,authorization.authorization('admin'), adminController.addAttendanceRecord);
router.post('/attendance/delete',verify,authorization.authorization('admin'), adminController.deleteAttendanceRecord);
router.post('/attendance/report',verify,authorization.authorization('admin'), adminController.generateUserAttendanceReport);
router.post('/leave/approve',verify,authorization.authorization('admin'), adminController.approveLeaveRequest);
router.post('/system-report',verify,authorization.authorization('admin'), adminController.generateSystemAttendanceReport);
router.get('/grading',verify,authorization.authorization('admin'), adminController.setUpGradingSystem);
router.get('/logout',verify, adminController.logoutUser);

module.exports = router;
