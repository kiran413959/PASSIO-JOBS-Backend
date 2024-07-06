const mongoose = require('mongoose')


const JobseekerSchema = new mongoose.Schema({

    
    UserType:{
        type:String
    },
    CandidateName:{
        type:String,
        require:true
    },
    CandidateEmail:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    }

})



module.exports={
    Jobseeker:mongoose.model("UserDetails",JobseekerSchema)
}