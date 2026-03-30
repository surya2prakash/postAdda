const Profile = require("../../Model/profileModel");

const Post = require("../../Model/postModel");

const Like = require("../../Model/likeModel");


exports.likePost = async(req,res) =>{
       try{

        const {postId} = req.body;

        const userDetails = req.user;

        if(!postId){
              return res.status(400).json({
                 success:false,
                 message:"Post Id Missing."
              });
        };

        if(!userDetails){
              return res.status(400).json({
                 success:false,
                 message:"User details is Missing."
              });
        };

        // check kro post Available hai bhi yaa nhi 
        
        const findPost = await Post.findById({_id:postId});

        if(!findPost){
              return res.status(400).json({
                 success:false,
                 message:"Post Not Found"
              })
        };

        const isAlreadyLike = await Like.findById({_id:findPost.like});

        if(isAlreadyLike.likeBy.includes(userDetails.profileId)){
  
                  
                  return res.status(200).json({
                     success:true,
                     message:"Post Already liked by user.",
                     isAlreadyLiked:true
                  })
        }
                
        const like = await Like.findByIdAndUpdate({_id:findPost.like},{$push:{likeBy:userDetails.profileId}},{new:true});

            

            if(!like){
                  return res.status(400).json({
                     success:false,
                     message:"Like Missing."
                  });
            };

            await Post.findByIdAndUpdate(postId,{$inc:{totalLike:1}},{new:true});

        return res.status(200).json({
             success:true,
             message:"Liked",
             isLike:true
        })

       }catch(err){
            console.error(err);

            return res.status(500).json({
                 success:false,
                 message:"Problem While Like Post."
            })
       }       
}