const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const dotenv=require('dotenv');
const connectDB = require('./config/db');
const userRoute=require('./routes/userRoute')
const blogRoute=require('./routes/blogRoute')
const path=require('path')

dotenv.config();



connectDB();

const app=express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/user', userRoute);
app.use('/api/v1/blog', blogRoute)


app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const PORT=process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server running on ${process.env.DEV_MODE} mode port no. ${PORT}`);
    
})