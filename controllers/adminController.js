const User = require('../models/user');
const Attendance = require('../models/attendance');
const Leave = require('../models/leave');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { viewUserAttendance } = require('./userController');

const adminLogin = asyncErrorHandler(async (req, res) => {
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
        role: user.role,
        name:user.fullName

      };
      const token = jwt.sign(payload, "AttendanceManagementSystem", {
        expiresIn: "1h",
      });
      const users=await User.findOne();
      const pendingleaves=await Leave.find({status:"pending"});
      res.cookie("token", token);
      users.role='admin';
      res.render("admin/adminDashboard",{users:users,pendingLeaves:pendingleaves});

  });

const viewAllUserRecords = asyncErrorHandler(async (req, res) => {
    
        const allUsers = await User.find({role:'user'});
        res.status(200).render('admin/allrecords',{user:allUsers })
    
});

const editUserAttendance = asyncErrorHandler(async (req, res) => {
    const { userId, date, status } = req.body;
        const attendance=await Attendance.findOneAndUpdate({ userId: userId, date: date }, { status: status });
        const pendingleaves=await Leave.find({status:"pending"});
        res.status(200).render('admin/adminDashboard',{pendingLeaves:pendingleaves});

});
const addAttendanceRecord = asyncErrorHandler(async (req, res) => {
    const { userId, date, status } = req.body;
    const newAttendance = await Attendance.create({
        userId: userId,
        date: date,
        status: status,
    });
});

const deleteAttendanceRecord = asyncErrorHandler(async (req, res) => {
    const { userId, date } = req.body;
    const attendance=await Attendance.findOneAndDelete({ userId: userId });
        if (!attendance) {
            return res.status(404).json({ error: "Attendance record not found" });
        }
        console.log(attendance)


        const pendingleaves=await Leave.find({status:"pending"});
        res.status(200).render('admin/adminDashboard',{pendingLeaves:pendingleaves});
});


const generateUserAttendanceReport = asyncErrorHandler(async (req, res) => {
    
       const{fullName,startDate,endDate}=req.body;
        const user = await User.findOne({fullName:fullName});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const attendanceRecords = await Attendance.find({
            userId: user._id,
            date: { $gte: startDate, $lte: endDate }
        });

        const totalAttendanceDays = attendanceRecords.filter(record => record.status === 'present').length;
        const totalLeaves = attendanceRecords.filter(record => record.status === 'absent').length;
        const totalDays = attendanceRecords.length;
        const percentageAttendance = (totalAttendanceDays / totalDays) * 100;

        const attendanceReport = {
            userId: user._id,
            fullName: user.fullName,
            startDate: startDate,
            endDate: endDate,
            totalAttendanceDays: totalAttendanceDays,
            totalLeaves: totalLeaves,
            percentageAttendance: percentageAttendance.toFixed(2) + "%"
        };
        res.status(200).render('admin/userReport',{report:attendanceReport})
});

const approveLeaveRequest = asyncErrorHandler(async (req, res) => {
    const { leaveId, status } = req.body;
        await Leave.findOneAndUpdate({ _id: leaveId }, { status: status });
        const pendingleaves=await Leave.find({status:"pending"});
        res.status(200).render('admin/adminDashboard',{pendingLeaves:pendingleaves});
});

const generateSystemAttendanceReport = asyncErrorHandler(async (req, res) => {
   
        const { fromDate, toDate } = req.body;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: "Date range is required" });
        }
        const attendanceRecords = await Attendance.find({
            date: { $gte: fromDate, $lte: toDate }
        });

        const totalDays = attendanceRecords.length;
        const totalPresent = attendanceRecords.filter(record => record.status === 'present').length;
        const totalAbsent = attendanceRecords.filter(record => record.status === 'absent').length;
        const averageAttendancePercentage = ((totalPresent + totalAbsent) / totalDays) * 100;

        const report = {
            fromDate,
            toDate,
            totalDays,
            totalPresent,
            totalAbsent,
            averageAttendancePercentage
        };
        res.status(200).render('admin/systemReport',{report:report});
});


const setUpGradingSystem = asyncErrorHandler(async (req, res) => {
        const gradingCriteria = [
            { grade: 'A', daysRequired: 26 },
            { grade: 'B', daysRequired: 20 },
            { grade: 'C', daysRequired: 15 },
            { grade: 'D', daysRequired: 10 },
         
        ];

        const currentDate = new Date();
        const users = await User.find({role:'user'});
        const attendanceRecord = await Attendance.find({
            date: { $lte: currentDate }
        });
        const gradedusers = users.map(user => {
            const userAttendanceRecords = attendanceRecord.filter(record => record.userId.toString() === user._id.toString());
            const totalAttendanceDays = userAttendanceRecords.filter(record => record.status === 'present').length;
            let grade = 'F'; 
            for (const criteria of gradingCriteria) {
                if (totalAttendanceDays >= criteria.daysRequired) {
                    grade = criteria.grade;
                    break;
                }
            }

            return { fullName: user.fullName, email: user.email, grade };
        });
        res.render('admin/grading', { gradedUsers:gradedusers });

    
});


const showloginform = (req, res) => {
    res.render("admin/adminLogin");
  };

const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.render("admin/adminLogin");
  };

module.exports = {
   adminLogin,
   viewAllUserRecords,
   viewUserAttendance,
   deleteAttendanceRecord,
   setUpGradingSystem,
   generateSystemAttendanceReport,
   generateUserAttendanceReport,
   approveLeaveRequest,
   editUserAttendance,
   showloginform,
   addAttendanceRecord,
   logoutUser
};
