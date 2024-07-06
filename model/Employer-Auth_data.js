const mongoose = require('mongoose')



const EmployerSchema = new mongoose.Schema({

    UserType:{
        type:String
    },
    CompanyName:{
        type:String,
        require:true
    },
    CompanyEmail:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    CompanyLocation:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})


module.exports={
    Employer:mongoose.model("Employerdata",EmployerSchema)
 
}