const Profile = require("../../Model/profileModel");

const Follower = require("../../Model/followerModel");

const Following = require("../../Model/followingModel");


exports.followingAndfollower = async(req,res) =>{
       try{
                
        // get the user id from the body
             const {userId} = req.body ;

                

             if(!userId){
              // if userId not found in body then return a bad request error ->
                   return res.status(400).json({
                     success:false,
                     message:"User Id Missing."
                   });
             };

            //  check the user profile is present  with this userId ->
          const isProfile = await Profile.findById(userId);

          if(!isProfile){
            // if Profile not Found then return ->
               return res.status(404).json({
                 success:false,
                 message:"Profile is Missing."
               })
          };

     
          // Fetch the following document linked to this profile
            const isFollower = await Follower.findById(isProfile?.followerId);

            if(!isFollower){
              // if profile is not found in follower document  then ->
                  return res.status(404).json({
                     success:false,
                     message:"Follower is not Found."
                  });
            };
            
     // Fetch the following document linked to this profile
            const isFollowing = await Following.findById(isProfile?.followingId);

            if(!isFollowing){
              // if profileId is not found in following document then return ->
                   return res.status(404).json({
                       success:false,
                       message:"Following is not Found"
                   })
            }
            
            const isInFollowing = isFollower.followBy.filter((element)=> isFollowing.followingTo.includes(element));

            // if every thing is okay then , prepare the response data ->
            const data ={
                  followerList:isFollower,
                  followingList:isFollowing,
                  isInFollowing:isInFollowing
            }
           
            // now return ->
            return res.status(200).json({
                 success:true,
                 message:"All Follower and Following List fetched.",
                 data
            })

       }catch(err){
        // if any error ->
           console.error(err.message);
           return res.status(500).json({
             success:false,
             message:"Problem while getting The followers lists."
           })
       }
} 