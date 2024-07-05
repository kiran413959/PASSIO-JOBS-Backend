const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({

    UserName:{
        type:String,
        require:true
    },
    UserEmail:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    Password:{
        type:String,
        require:true
    }

})

module.exports={
    User:mongoose.model("UserDetails",userSchema)
}