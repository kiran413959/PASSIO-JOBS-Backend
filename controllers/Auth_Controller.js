const { User } = require("../model/Auth_data");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const { JWT_EXPIRE } = require("../config/keys");
const { JWT_COOKIE_EXPIRE } = require("../config/keys");

module.exports = {
  signuppost: async (req, res) => {
    //Getting Data from the body

    const { 
        Username,
        Useremail,
        mobile,
        password,
        Confirm_Password
     } = req.body;

     //Checking if the user already exists
   

    try {
      const Existeduser = await User.findOne({
        Useremail: Useremail,
      });
      if (Existeduser) {
        return res
          .status(400)
          .json({ msg: "User Already Exis", status: false });
      }
      //Checking that the password and confirm password are same or not
      if (password !== Confirm_Password) {
        return res
          .status(400)
          .json({
            msg: "Password and Confirm Password are not same",
            status: false,
          });
      }
      //Hashing the password

      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      //Creating the user in the database
      const user = new User({
        Username: Username,
        Useremail: Useremail,
        mobile: mobile,
        password: hashedpassword,
      });
      await user.save();
      res.status(200).json({ msg: "User Created Successfully", status: true });
    } catch (err) {
      console.log(err);
    }
  },

  //Login Route


  loginpost: async(req,res)=>{

        //Getting Data from the body
    const {Useremail,password}=req.body;
    try {
            //checking if the user exist

        const Existeduser=await User.findOne({Useremail:Useremail});
        if(!Existeduser) return res.status(400).json({msg:"User does not exist",status:false});
        
        //Checking the password
        const isMatch=await bcrypt.compare(password,Existeduser.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials",status:false});
        
        //Creating payload
        const payload={
            id:Existeduser._id,
            Useremail:Existeduser.Useremail,
          
        };


        //Generating the token
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'30d'}); 
        
        //Sending the token to the user
            res.status(200).json({msg:"Login Successfull",status:true,token:token

                });

                } catch (err) {
                    console.log(err);
                    }
  }


}
