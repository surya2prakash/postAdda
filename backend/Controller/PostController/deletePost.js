const Post = require("../../Model/postModel");
const Profile = require("../../Model/profileModel");

const Like = require("../../Model/likeModel");
const Comment = require("../../Model/commentModel");

// single Delete
exports.deletePost = async(req,res) =>{
         try{
          
            const postId = req.params.id ;
                 
            const userDetails = req.user ;

            if(postId){
                 return res.status(400).json({
                     success:false,
                     message:"Post Id Missing."
                 });
            };
           
            if(!userDetails){
                  return res.status(400).json({
                     success:false,
                     message:"User Details Missing."
                  });
            };
          
            const checkPost = await Post.findOneAndDelete({_id:postId,profileId:userDetails.profileId})
                
            
           

            if(!checkPost){
                  return res.status(404).json({
                     success:false,
                     message:"Post Not Found."
                  })
            };
             
      const updatedPosts =      await Profile.findByIdAndUpdate({_id:userDetails.profileId},{$pull:{postId:postId}},{new:true}).populate({
            path:"postId",
             
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
      }).exec();

            await Like.findOneAndDelete({postId:postId});

            await Comment.findOneAndDelete({postId:postId});

            return res.status(200).json({
                 success:true,
                 message:"Post Delete.",
                 data:updatedPosts.postId
            })



         }catch(err){
              console.error(err);

              return res.status(500).json({
                 success:false,
                 message:"Problem While Delete the Post."
              })
         }
}