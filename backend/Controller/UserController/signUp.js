const User = require("../../Model/userModel");
const validator = require("validator");

const bcrypt = require("bcrypt");
const Profile = require("../../Model/profileModel");

const Follower = require("../../Model/followerModel");
const Following = require("../../Model/followingModel");

exports.signUp = async(req,res)=>{
       try{
         
            //name ,email ,password ,confirmPassword ---> 
        const {fullName,email,password,confirmPassword} = req.body;

        if(!fullName ){
            // if fullname not found then ->
              return res.status(404).json({
                  success:false,
                  message:"Name is Missing."
              });
        };

        if(!email  || !validator.isEmail(email)){
            // checking two things -> email not found and a email is not valid email
              return res.status(404).json({
                 success:false,
                 message:"Email is missing or Not a valid Email"
              });
        };

        if(password === ''){
            // if password is empty then ->
              return res.status(404).json({
                 success:false,
                 message:"Password is Missing."
              });
        };

        if(password !== confirmPassword){

            // if password is not equal to confirm password then ->
              return res.status(404).json({
                 success:false,
                 message:"Password Not Match"
              });
        };


        // if every thing is okay then , check -> Is email already present in User doc or not .  

        const isAlready = await User.findOne({email:email});

        if(isAlready){
            // if email present that means -> a user account  is already exist with the current email then ->
              return res.status(400).json({
                 success:false,
                 message:"User have an account."
              });
        };

      //   if not then -> hash the password using bcrypt 

        const hashPassword = await bcrypt.hash(password,10); 

      // create a user doc and save.  
        const newUser = new User({
              fullName:fullName,
              email:email,
              password:hashPassword
        });

           await newUser.save();

      //Now split the fullname on the basis of space -> for Profile Image     
    let splitName = fullName.split(" ");
       
//     split methods returns the array of strings -> ["Rohan","Sharma"]
//     take the first latter ->
      let firstName = splitName[0];
      let lastName = null;     
      if( splitName[1]){
      // if space is present -> 
       lastName = splitName[1][0]; 
    }else{
      // if space is not then -> it take two latter of the fullName -> "RH"
        lastName=splitName[0][1];  
    }

//     using two latters -> create a image ->
      let imageUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`

      //  image, userId, and name in Proifle Doc.
        const newProfile = new Profile({
             userId:newUser._id,
             profileImage:imageUrl,
             fullName:fullName
        })  

        await newProfile.save();

      // create follower doc ->  
        const newFollower = new Follower({
              followTo:newProfile._id
        });

        await newFollower.save();

      //   following Doc ->
        const newFollowing = new Following({
               followingBy:newProfile._id
        });

        await newFollowing.save();

      //   update followerId and followingId in profile
           await Profile.findByIdAndUpdate(newProfile._id,{followerId:newFollower._id,followingId:newFollowing._id});

      // every thing is okay then send the response ->      
        return res.status(200).json({
              success:true,
              message:"Account Created.",
              
        })

       }catch(err){
            //while getting error -> 
          console.error(err);
          return res.status(500).json({
               success:false,
               message:"Problem While Sign Up."               
          })
       }
}