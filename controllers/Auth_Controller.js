const { Jobseeker } = require("../model/Jobseeker-Auth_data");
const { Employer } =require("../model/Employer-Auth_data")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const { JWT_EXPIRE } = require("../config/keys");
const { JWT_COOKIE_EXPIRE } = require("../config/keys");

module.exports = {
  signuppost: async (req, res) => {
    //Getting Data from the body
    const UserType = req.params.Usertype

    //Checking if the user type is valid or not
    if (UserType!== "Jobseeker" && UserType!== "employer") {

      return res.status(400).json({ msg: "Invalid User Type", status: false });
    }
    
    else if(UserType == "Jobseeker"){ 

      const { 
        CandidateName,
        CandidateEmail,
          mobile,
          password,
          Confirm_Password
      } = req.body;

     //Checking if the user already exists
   

    try {
      const ExistedCandidate = await Jobseeker.findOne({CandidateEmail: CandidateEmail,});

      const ExistedEmployer = await Employer.findOne({CompanyEmail:CandidateEmail})
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
      await jobseeker.save();
      res.status(200).json({ msg: "User Created Successfully", status: true });
    } catch (err) {
      console.log(err);
    }
  }
  else if(UserType == "employer"){

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
      res.status(200).json({ msg: "User Created Successfully", status: true });
    } catch (err) {
      console.log(err);
    }
  }



  },

  //Login Route


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





}
