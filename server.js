const express = require('express')
const app = express();
const mongoose = require('mongoose');
const port = process.env.port || 4201
const path = require('path')
const env = require('dotenv')
const cors= require('cors')
env.config()

app.use(cors())
mongoose.connect(process.env.DB_LINK).then(()=>{
    console.log("DB is runing");
})
.catch((err)=>{
    console.log(err);
})



const router = require('./routes/Auth_Routes')

app.use(express.static('Public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.use( '', router)




app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
