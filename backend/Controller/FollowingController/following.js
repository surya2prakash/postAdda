const Profile = require("../../Model/profileModel");

const Following = require("../../Model/followingModel");

const Follower = require("../../Model/followerModel");


exports.followUser = async(req,res) =>{
       try{

        // user Id from body ->
        const userId =  req.body.userId ;
           
        
              
        // profile Id from payload -->
        const currUser = req.user.profileId;


        if(userId === '') {
            // if user Id is empty then ->
              return res.status(400).json({
                 success:true,
                 message:"User Id Missing."
              });
        };

          const checkProfile = await Profile.findById(userId);
        
                if(!checkProfile){
                    // if profile not found then ->
                      return res.status(404).json({
                         success:false,
                         message:"Profile Not Found."
                      })
                }
        
                //check is already follow ->
        
                const isAlready = await Following.findOne({followingTo:userId,followingBy:currUser});
        
                if(isAlready){
                    // if user already follow then ->
                         return res.status(400).json({
                             success:false,
                             message:"User Already Unfollow."
                         });
                };


            //  if user not follow then update in following 
           await Following.findOneAndUpdate({followingBy:currUser},{$push:{followingTo:userId}},{new:true});
        // update other user follower ->
         await Follower.findOneAndUpdate({followTo:userId},{$push:{followBy:currUser}},{new:true});
        // increase other user total follower  count ->
           await Profile.findByIdAndUpdate(userId,{$inc:{totalFollowers:1}},{new:true});
        // increse user total following count
        const  profileTwo      = await Profile.findByIdAndUpdate(currUser,{$inc:{totalFollowing:1}},{new:true}).populate({
                                                                                        path:"followingId",
                                                                                           populate:({
                                                                                                path:"followingTo",
                                                                                        model:"Profile"
                                                                                           })
                                                                                     } ).populate({path:"followerId",
                                                                                         populate:({
                                                                                           path:"followBy",
                                                                                           model:"Profile"
                                                                                         }),}).exec();

                // if every thing going well return this ->
                 return res.status(200).json({
                     success:true,
                     message:"Following Started.",
                     data:{
                    
                     profile: profileTwo,
                     
                     } 
                 })

       }catch(err){
        // if error ->
        console.error(err);

           return res.status(500).json({
             success:false,
             message:"Problem While Follow User."
           })
       }
}