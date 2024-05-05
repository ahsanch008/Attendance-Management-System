const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verify = require('./../utils/verify');

router.get('/login', userController.showloginform);
router.get('/signup', userController.showsignupform);
router.post('/login', userController.loginUser);
router.post('/signup', userController.createUser);
router.get('/logout', userController.logoutUser);
router.post('/mark-attendance',verify, userController.markAttendance);
router.get('/view-attendance',verify, userController.viewUserAttendance);
router.get('/create-leave-request',verify, userController.showleaveform);
router.post('/create-leave-request',verify, userController.createLeaveRequest);
router.get('/edit-details',verify, userController.showeditform);
router.post('/edit-details',verify, userController.editUserDetails);



module.exports = router;
