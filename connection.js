
const mongoose = require('mongoose');
async function connectdb(){
    return mongoose.connect('mongodb://127.0.0.1:27017/AttendanceManagement')
    .then(()=>{
        console.log("Connected to Mongodb")

    })
    .catch((err)=>{
        console.error("Error connecting to Mongodb",err)
    })
}
module.exports=connectdb;