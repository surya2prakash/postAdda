const User = require("../../Model/userModel");

const Profile = require("../../Model/profileModel");

const bcrypt = require("bcrypt");

const validator = require("validator");

const jwt = require("jsonwebtoken");

 require("dotenv").config();


exports.logIn = async(req,res) =>{
       try{
           
         // email and password from the body -->
        const {email,password} = req.body;
        


      //   check email is valid and if email is empty then ->
        if(!validator.isEmail(email) || email === ''){
               return res.status(400).json({
                 success:false,
                  message:"Email is Missing or Email is Not Vaild"
               });
        };

      //   if password is empty then -->
       if(password === ''){
           return res.status(400).json({
               success:false,
               message:"Password is Missing."
           });
       };

      //  check user is present Or not on User doc with email.
         const isAlready = await User.findOne({email:email}).select("+password");

         //  if user Is not present in User doc .
         if(!isAlready){
            return res.status(400).json({
                  success:false,
                  message:"User Not Exist"
            });
         };
         
         //check the password ->  
         const verifyPassword = await bcrypt.compare(password,isAlready.password);
           
         // if password not match than ->
         if(!verifyPassword){
              return res.status(400).json({
                success:false,
                message:"Wrong Password."
              });
         };

         // user found with email and password match then -> get the user Profile Doc -> 
         const profileDetails = await Profile.findOne({userId:isAlready._id}).populate({path:"userId",model:"User"}).populate({path:"postId",
                  populate:[
                       {
                         path:"like",
                          populate:{
                                path:"likeBy",
                                model:"Profile"
                          }
                       },
                       {
                          path:"comment",
                          populate:{
                               path:"comments.commentBy",
                               model:"Profile"
                          }
                       },
                       {
                         path:"profileId",
                         model:"Profile"
                       }
                  ]
           }).populate({
              path:"followerId",
                populate:{
                   path:"followBy",
                   model:"Profile"
              }
         }).populate({
             path:"followingId",
             populate:{
                    path:"followingTo",
                    model:"Profile"
               }
         }).exec();

      //payload ->   
         const payload = {
               id:isAlready._id,
               email:isAlready.email,
               name:isAlready.fullName,
               profileId:profileDetails._id,
               profileImage:profileDetails.profileImage
         }
//  create jwt token which expire in "2-hour" 
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'2h'});

               
//   every thing is okay then send the response ->
          return res.status(200).json({
             success:true,
             message:"User Login.",
             data:{
                   
                   profile:profileDetails,
                   token:token
             }
          });

       }catch(err){
         // if error ->
          console.error(err);
          return res.status(500).json({
               success:false,
               message:"Problem While LogIn."
          })
       }
}