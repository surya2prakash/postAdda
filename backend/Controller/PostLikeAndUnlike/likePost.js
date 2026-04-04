

const Post = require("../../Model/postModel");




exports.likePost = async(req,res) =>{
       try{

        const postId = req.params.id ;

     

        if(!postId){
              return res.status(400).json({
                 success:false,
                 message:"Post Id Missing."
              });
        };

       

        // check kro post Available hai bhi yaa nhi 
        
        const findPost = await Post.findById({_id:postId}).populate({
          path:"like",
          populate:{
                path:"likeBy",
                method:"Profile"
          }
        });

        if(!findPost){
              return res.status(400).json({
                 success:false,
                 message:"Post Not Found"
              })
        };

       
        return res.status(200).json({
             success:true,
             message:"Users Like The Post",
             data:findPost
        })

       }catch(err){
            console.error(err);

            return res.status(500).json({
                 success:false,
                 message:"Problem While Like User."
            })
       }       
}