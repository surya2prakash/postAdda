const Post = require("../../Model/postModel");

const Like = require("../../Model/likeModel");



exports.unlikePost = async(req,res) =>{
       try{
          
         // postId from body -->
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
        
                // check post is avaliable or not ---> 
               
                const findPost = await Post.findById({_id:postId});
        
                if(!findPost){
                      return res.status(400).json({
                         success:false,
                         message:"Post Not Found"
                      })
                };
        
               //  check is post like by the user --->
                const isAlreadyLike = await Like.findById({_id:findPost.like});
                     // if not then --->
                if(!isAlreadyLike.likeBy.includes(userDetails.profileId)){
          
                          
                          return res.status(200).json({
                             success:true,
                             message:"Post Already unliked by user.",
                             isAlreadyUnLiked:true
                          })
                }
         //  if like then remove the profileId --->
   const like = await Like.findByIdAndUpdate({_id:findPost.like},{$pull:{likeBy:userDetails.profileId}},{new:true});

         if(!like){
                  return res.status(400).json({
                     success:false,
                     message:"unLike Missing."
                  });
            };
            //  decrease the like count --->
                await Post.findByIdAndUpdate(postId,{$inc:{totalLike:-1}},{new:true});
      
               //  return res --->
       return res.status(200).json({
             success:true,
             message:" unLiked",
             isLike:true
        })

       }catch(err){
          console.error(err);

          return res.status(500).json({
             success:false,
             message:"Problem while Unlike Post."
          })
       }
}