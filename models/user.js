const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, required: [true,"Name is required"] },
  email: { 
    type: String, required: [true,"Email is required"], unique: true },
  password: {
     type: String, required: [true,"Password is required"] },
  confirmPassword: {
        type: String,required: [true, "Please confirm the password"],},
  profilePicture: { 
    type: String },
  role: {
     type: String, enum: ['user', 'admin'], default: 'user' },
},
 { timestamps: true });

 userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 5);
    this.confirmPassword = undefined;
    next();
  });

const User = mongoose.model('User', userSchema);

module.exports = User;
