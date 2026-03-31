const Profile = require("../../Model/profileModel");

const Following = require("../../Model/followingModel");
const Follower = require("../../Model/followerModel");



exports.unfollowUser = async(req,res) =>{
       try{

         // take user id from body
        const {userId} = req.body ;

        console.log("unfollow");
          
      //   take profileId from payload 
        const currUser = req.user.profileId ;

         //  if user Id is missing then send a bad request error ->
        if(userId === '') {
              return res.status(400).json({
                 success:true,
                 message:"User Id Missing."
              });
        };

      //   check profile document is exist with this userId
        const checkProfile = await Profile.findById(userId);

        if(!checkProfile){
              return res.status(404).json({
                 success:false,
                 message:"Profile Not Found."
              })
        }

        
            // check  following document that is userId already into this ->
        const isfollowing = await Following.findOne({followingTo:userId,followingBy:currUser});
         //   check  follower document , is this userId and profileId is into it ->
        const isFollower = await Follower.findOne({followTo:userId,followBy:currUser});

// if not in both case that means -> user not follow the second user .
        if(!isfollowing){
                 return res.status(400).json({
                     success:false,
                     message:"User Already Unfollow."
                 });
        };
            
        if(!isFollower){
               return res.status(400).json({
                     success:false,
                     message:"User Already Unfollow."
                 }); 
        }
        
 //  if true -> remove the first userId  from the profileUser following doc.  
        const updatedFollowing =   await Following.findOneAndUpdate({followingBy:currUser},{$pull:{followingTo:userId}},{new:true}).populate({
                    path:"followingTo",
                    model:"Profile"
               });;
      //   then remove the profile user from the follower doc of userId user ->
        const updatedFollower =   await Follower.findOneAndUpdate({followTo:userId},{$pull:{followBy:currUser}},{new:true}).populate({
                   path:"followBy",
                   model:"Profile"
              }).exec();
      //  decrese the total following and total follower count ->
            await Profile.findByIdAndUpdate(userId,{$inc:{totalFollowers:-1}},{new:true});
        const profileTwo =    await Profile.findByIdAndUpdate(currUser,{$inc:{totalFollowing:-1}},{new:true}).exec();

      //   return the response ->
        return res.status(200).json({
             success:true,
             message:"Unfollow SuccessFully",
             data:{
                following:updatedFollowing,
                follower:updatedFollower ,               
               profile:profileTwo
             } 
        })

       }catch(err){
         // if error ->
          console.error(err);

          return res.status(500).json({
              success:false,
              message:"Problem while Unfollow"
          })
       }
}