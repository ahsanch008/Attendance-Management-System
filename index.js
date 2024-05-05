const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const connectDB = require('./connection');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use(cookieparser())
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.get('/home',(req,res)=>{
    res.render('homepage');
})

app.set('views',path.resolve('./views'))
app.set('view engine','ejs')
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
