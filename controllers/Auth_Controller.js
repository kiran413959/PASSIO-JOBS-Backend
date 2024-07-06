const { Jobseeker } = require("../model/Jobseeker-Auth_data");
const { Employer } =require("../model/Employer-Auth_data")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");





module.exports = {

  signupget: async(req,res)=>{
  },

  //Signup Route
  signuppost: async (req, res) => {

    //Getting Data from the body
    let UserType = req.params.userType
    //Checking if the user type is valid or not
    console.log(UserType);
    
    
    


    if(UserType == "Jobseeker"){ 
      const { 
            CandidateName,
            CandidateEmail,
            mobile,
            password,
            Confirm_Password
      } = req.body;

  
    //Checking if the user already exists
    try {
      //Checking From Candidate side
      const ExistedCandidate = await Jobseeker.findOne({CandidateEmail: CandidateEmail,});

      //Checking From Employer Side
      const ExistedEmployer = await Employer.findOne({CompanyEmail:CandidateEmail})

      //Putting a condition for if one of these user existed
      if (ExistedCandidate || ExistedEmployer) {
        return res.status(400).json({ msg: "User Already Exis", status: false });
      }

      //Checking that the password and confirm password are same or not
      if (password !== Confirm_Password) {
          return res.status(400).json({
              msg: "Password and Confirm Password are not same",
              status: false
          });
      }

      //Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      //Creating the user in the database
      const jobseeker = new Jobseeker({
        UserType:UserType,
        CandidateName: CandidateName,
        CandidateEmail: CandidateEmail,
        mobile: mobile,
        password: hashedpassword,
      });

      //Saving new user Details
      await jobseeker.save();
      console.log(jobseeker);
      res.status(200).json({ msg: "User Created Successfully", status: true });
    } 
    catch (err) {
      console.log(err);
    }
  }
  else if(UserType == "Employer"){

    const { 
      CompanyName,
      CompanyEmail,
        mobile,
        CompanyLocation,
        password,
        Confirm_Password
     } = req.body;
     //Checking if the user already exists
     try {
      const ExistedEmployer = await Employer.findOne({CompanyEmail: CompanyEmail});
      const ExistedCandidate = await Jobseeker.findOne({CandidateEmail: CompanyEmail,});

      if (ExistedEmployer || ExistedCandidate) {
        return res.status(400).json({ msg: "User Already Exis", status: false });
      }
      //Checking that the password and confirm password are same or not
      if (password!== Confirm_Password) {
        return res.status(400).json({msg: "Password and Confirm Password are not same",status: false,});
      }
      //Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      //Creating the user in the database
      const employer = new Employer({
        UserType:UserType,
        CompanyName: CompanyName,
        CompanyEmail: CompanyEmail,
        mobile: mobile,
        CompanyLocation: CompanyLocation,
        password: hashedpassword,
      });
      await employer.save();

        console.log(employer);
      res.status(200).json({ msg: "User Created Successfully", status: true });
    } catch (err) {
      console.log(err);
    }
  }else{

    if (UserType!== 'Jobseeker' ||  'Employer') {
      
      return res.status(400).json({ msg: "Invalid User Type", status: false });
    }

  }



  },

  //Login Route



  loginget: async(req,res)=>{

  },




  loginpost: async(req,res)=>{

        //Getting Data from the body
    const {Useremail,password}=req.body;
    try {

        //Checking the user is Employer or Candidate

        const Candidate = await Jobseeker.findOne({CandidateEmail:Useremail});
        const Employer = await Employer.findOne({CompanyEmail:Useremail});

        //If the user does not exist

        if(!Candidate &&!Employer) {

          return res.status(400).json({msg:"User does not exist",status:false});

        }else if(Candidate) {

          UserType="Jobseeker";

          //Checking the password
        const isMatch=  bcrypt.compare(password,Candidate.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials",status:false});

          //Creating payload for the token
          const payload={
            id:Candidate._id,
            Useremail:Candidate.CandidateEmail,
            UserType:UserType
          };
          //Generating the token
          const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'30d'});
          //Sending the token to the user
          res.status(200).json({msg:"Login Successfull",status:true,token:token});

          
        }
        else {
          UserType="Employer";
        
          //Checking the password


        const isMatch=  bcrypt.compare(password,Employer.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials",status:false});


        
          //Creating payload for the token
          const payload={
            id:Employer._id,
            Useremail:Employer.CandidateEmail,
            UserType:UserType
          };
          //Generating the token
          const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'30d'});
          //Sending the token to the user
          res.status(200).json({msg:"Login Successfull",status:true,token:token});
        }

      } catch (err) {
            console.log(err);
       }
  },


  homeget: async(req,res)=>{

  },
  resume_selectionget: async(req,res)=>{
    
  },
  resume_selectionpost: async(req,res)=>{
    
  },
  experienceget: async(req,res)=>{
    
  },
  experiencepost: async(req,res)=>{
    
  },
  QandAget: async(req,res)=>{
    
  },

  QandApost: async(req,res)=>{
  }


}
