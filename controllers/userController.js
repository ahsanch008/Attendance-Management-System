const User = require('../models/user');
const Attendance = require('../models/attendance');
const Leave = require('../models/leave');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require('../utils/asyncErrorHandler');

const decodeTokenAndFindUser = async (token) => {
    try {
        const decodedToken = jwt.verify(token, "AttendanceManagementSystem");
        const user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error("Failed to decode token or find user");
    }
};

const createUser = asyncErrorHandler(async (req, res) => {
    const { fullName, email,password, confirmPassword, profilePicture } = req.body;
    if (!email || !password || !confirmPassword || !fullName ) {
      return res.status(400).json({ err: "All field are required." });
    }
    const user = await User.create({
      fullName,
      email,
      password,
      confirmPassword,
      profilePicture,
    });
  
    res.status(201).redirect('/user/login')
  });

  const loginUser = asyncErrorHandler(async (req, res) => {
    const { email,password} = req.body;
    if (!email || !password ) {
      return res.status(400).json({ err: "All field are required." });
    }
    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const payload = {
        email: user.email,
        name:user.fullName
      };
      const token = jwt.sign(payload, "AttendanceManagementSystem", {
        expiresIn: "1h",
      });
      res.cookie("token", token);

      const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const existingAttendance = await Attendance.findOne({ userId: user._id, date: currentDate });
      res.render("user/userDashboard",{user,attendanceMarked:existingAttendance});

  });

  const markAttendance = asyncErrorHandler(async (req, res) => {
  
        const token = req.cookies?.token;
        const user = await decodeTokenAndFindUser(token);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const existingAttendance = await Attendance.findOne({ userId: user._id, date: currentDate });
        const newAttendance = await Attendance.create({
            userId: user._id,
            date: currentDate,
            status: 'present',
        });
        
        res.render("user/userDashboard",{user,attendanceMarked:existingAttendance});
    
});

const viewUserAttendance = asyncErrorHandler(async (req, res) => {
        const token = req.cookies?.token;
        const user = await decodeTokenAndFindUser(token);
        const userAttendance = await Attendance.find({ userId: user._id });
        
        res.status(200).render('user/userAttendance',{attendance:userAttendance});
});

const createLeaveRequest = asyncErrorHandler(async (req, res) => {
    
        const token = req.cookies?.token;
        const user = await decodeTokenAndFindUser(token);
      
        const { startDate, endDate,userName } = req.body;
        const newLeaveRequest = await Leave.create({
            userId: user._id,
            startDate,
            endDate,
            userName
        });
        
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const existingAttendance = await Attendance.findOne({ userId: user._id, date: currentDate });
      res.render("user/userDashboard",{user,attendanceMarked:existingAttendance});
   
});

const editUserDetails = asyncErrorHandler(async (req, res) => {
  const token = req.cookies?.token;
  const user = await decodeTokenAndFindUser(token);
 
  const { fullName, email, password, confirmPassword, profilePicture } = req.body;
  if (!email || !password || !confirmPassword || !fullName ) {
      return res.status(400).json({ err: "All fields are required." });
  }
  user.fullName = fullName;
  user.email = email;
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.profilePicture = profilePicture;
  
  await user.save();
   const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const existingAttendance = await Attendance.findOne({ userId: user._id, date: currentDate });
      res.render("user/userDashboard",{user,attendanceMarked:existingAttendance});
});

  const showloginform = (req, res) => {
    res.render("user/userLogin");
  };
  const showsignupform = (req, res) => {
    res.render("user/userSignup");
  };
  const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.render("user/userLogin");
  };
  const showleaveform=(req,res)=>{
    res.render('leaveForm');
  };
  const showeditform=asyncErrorHandler(async(req,res)=>{
    const token = req.cookies?.token;
  const user = await decodeTokenAndFindUser(token);
    res.render('user/editDetails',{user});
  });

  module.exports={
    showloginform,
    showsignupform,
    logoutUser,
    loginUser,
    createUser,
    createLeaveRequest,
    markAttendance,
    viewUserAttendance,
    showleaveform,
    editUserDetails,
    showeditform
  };