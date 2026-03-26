const User = require("../../Model/userModel");
const ForgetPassword = require("../../Model/forgetPasswordModel");


const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");



exports.forgetPassword = async (req,res) =>{
      try{
          
           const {email} = req.body ;
            

           if(!email){
              return res.status(400).json({
                 success:false,
                 message:"Email is Missing."
              })
           };

           const userFound = await User.findOne({email:email});

          

           if(!userFound){
              return res.status(404).json({
                 success:false,
                 message:"User Not Found."
              });
           };

           const genrateOtp = Math.floor(100000 + Math.random()*900000).toString();

           const saveOtp = ForgetPassword({
               userId:userFound._id,
               email:userFound.email,
                otp:genrateOtp
           });

              saveOtp.save();

              const payload ={
                   email:userFound.email,
                   id:userFound._id,
              }

           const temptoken =  jwt.sign(payload,process.env.TEMP_SECRET,{expiresIn:"5m"});


             return res.cookie("token",temptoken,{
                 httpOnly:true,
                 secure:false,
                 maxAge:5*60*1000
             }).status(200).json({
                 success:true,
                 message:"Otp is Send On Your Email" ,
                 temp:temptoken
             });

      }catch(err){
           console.error(err.message);
           return res.status(500).json({
             success:false,
             message:"problem while email in forget Password.."
           });
      }
};


exports.tempAuthVerify = async(req,res,next) =>{
      try{
              const tempToken = req.cookies.token ;

              console.log("token",tempToken);

              if(tempToken.toString() === ""){
                   return res.status(400).json({
                     success:false,
                     message:"Token Missing from Header"
                   });
              };

              const temp = tempToken.split(" ").pop();
               
              if(temp.toString() === ""){
                   return res.status(400).json({
                     success:false,
                     message:"Token is Missing."
                   });
              };
                console.log("token process done");
                 const decode =  jwt.verify(tempToken,process.env.TEMP_SECRET);
                  
                 req.forPass =decode;

                 next();


      }catch(err){
          console.error(err.message);
          return res.status(500).json({
             success:false,
             message:"Problem While verify "
          })
      }
}


exports.verifyOtp = async(req,res) =>{
       try{

           const {otp} = req.body ;
           console.log("otp section ---->",otp);
            
           const {email,id} = req.forPass ;

           if(!otp){
              return res.status(400).json({
                 success:false,
                 message:"Enter Otp , Otp is Missing."
              })
           };
         
           const isVerifyed = await ForgetPassword.findOne({userId:id,email:email,otp:otp}) ;

           if(!isVerifyed){
                 return res.status(400).json({
                     success:false,
                     message:"Otp Not Verifyed."
                 });
           };
         
           return res.status(200).json({
             success:true,
             message:"Otp Verifyed."
           })

       }catch(err){
           console.error(err);
           return res.status(500).json({
             success:false,
             message:"Problem While Otp verification."
           })
       }
};









exports.setNewPassword = async(req,res)=>{
      try{

        const {password,confirmPassword} = req.body ;

          const {id} = req.forPass ;

        if(!password || !confirmPassword){
               return res.status(400).json({
                 success:false,
                 message:"Both Inputs fields are empty."
               })
        };

        if(!password && confirmPassword){
              return res.status(400).json({
                 success:false,
                 message:"Password field is empty."
              });
        };

        if(password && !confirmPassword){
               return res.status(400).json({
                 success:false,
                 message:"Confirm Password Field is empty."
               })
        };

        if(password.toString() !== confirmPassword.toString()){
              return res.status(400).json({
                 success:false,
                 message:"Password and Confirm password Not Match."
              });
        };
          
          const hashedPassword = await bcrypt.hash(password,10);

          const user = await User.findByIdAndUpdate(id,{password:hashedPassword},{new:true});

            if(!user){
                  return res.status(404).json({
                     success:false,
                     message:"User Not Found."
                  });
            };
            
           

            res.status(200).json({
                 success:true,
                 message:"Password Changed."
            });
             

      }catch(err){
           console.err(err.message);
           return res.status(500).json({
             success:false,
             message:"Problem While Updating Password Section."
           })
      }
}