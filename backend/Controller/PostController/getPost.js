const Post = require("../../Model/postModel");
const Profile = require("../../Model/profileModel");


// user all Post  --->
exports.getUserPosts = async(req,res)=>{
       try{
         //  user from payload --->
        const userDetails = req.user;

        if(!userDetails){
              return res.status(400).json({
                  success:false,
                  message:"UserDetails Missing."
              });
        };

      //   check user in profile doc -->
     const findProfile = await Profile.findById({_id:userDetails.profileId});

        if(!findProfile){
              return res.status(400).json({
                 success:false,
                 message:"Profile Missing."
              })
        };

      //  check posts with profileId ----> 
     const findPosts = await Post.find({profileId:findProfile._id}).populate([{                 
                     path:"like"
                   },{                      
                      path:"comment"
                   }]).exec();

                  //  if posts length is greater then 0 then --->
        if(findPosts.length > 0 ){
              return res.status(200).json({
                  success:true,
                  message:"Post fetch Successfully.",
                  data:{
                      user:findProfile,
                      posts:findPosts
                  }
              })
        }

      //   if not then return no post --->
        return res.status(404).json({
             success:false,
             message:"No Post."
        });
         

       }catch(err){
        console.error(err);

        return res.status(500).json({
             success:false,
             message:"Problem While Getting All Posts."
        })
       }
}; 

// this is for get all user posts for feed section --->
exports.getAllPosts = async(req,res)=>{
       try{
           
           //user from payload --->
          const userDetails = req.user;
           
         // page and limit for lazy loading ----> 
          const page = parseInt(req.query.page) || 1 ;
          const limit = parseInt(req.query.limit) || 7;

          
         // skip page that track the post to skip --->
          const skipPage = (page-1)*limit ;

          if(!userDetails){
             return res.status(400).json({
                 success:false,
                 message:"User Details is missing."
             });
          };
// check the user into the profile doc --->
          const checkProfile = await Profile.findById({_id:userDetails.profileId});

          if(!checkProfile){
              return res.status(400).json({
                 success:false,
                 message:"Profile Missing."
              })
          };
         // time period of 24 hr -- with in 24 hr all posts posted by the users --->  
          const timePeriod = new Date(Date.now()- 24*60*60*1000);
         
          let allPosts = await Post.find({createdAt:{$gte:timePeriod}}).sort({createdAt:-1}).populate([{ 
                       model:"Like",                    
                     path:"like"
                   },{ 
                        model:"Comment",                     
                      path:"comment" ,
                      populate:{
                            path:"comments.commentBy",
                            model:"Profile"
                      }
                   }]).populate({
                      
                      path:"profileId",
                      populate:{
                        path:"followingId",
                         populate:{
                         path:"followingTo",
                         model:"Profile"
                      }             
                      }
                      
                      
               
                   }).populate({
                      
                      path:"profileId",
                      populate:{

                      path:"followerId",
                      populate:{
                         path:"followBy",
                         model:"Profile"
                      }
                     }
                      
               
                   }).skip(skipPage).limit(limit).exec();
// if posts are more then 7 it send first 7 post then after it send the next 7 ---and so on --->
          
            //  if within last 24 hr no post are posted by the users then it check 48hr time --->
          if(allPosts.length >= 0){

             const secTimePeriod = new Date(Date.now() - 2*24*60*60*1000);
            //   if posts are 0 in 24 hr then -->
             if(allPosts.length === 0){
                   allPosts = await Post.find({createdAt:{$gte:secTimePeriod}}).sort({createdAt:-1}).populate([{
                     model:"Like",
                     path:"like"
                   },{
                      model:"Comment",
                      path:"comment",
                      populate:{
                            path:"comments.commentBy",
                            model:"Profile"
                      }
                   }]).populate({
                      model:"Profile",
                      path:"profileId"
                   }).skip(skipPage).limit(limit).exec();
             
                  //  posts are found then return -->
          return res.status(200).json({
                 success:true,
                 message:"All Posts Fetched.",
                 data:{
                     posts:allPosts,
                    
                 }
               })
             };
            //  posts are found then return -->
               return res.status(200).json({
                 success:true,
                 message:"All Posts Fetched.",
                 data:{
                     posts:allPosts,
                    
                 }
               })
          }
// no posts are found then return -->
          return res.status(500).json({
             success:false,
             message:"No Post Found."
          })

       }catch(err){
        console.error(err);

        return res.status(500).json({
             success:false,
             message:"Problem while fetching All Post."
        })
       }
};


exports.getSinglePost = async(req,res) =>{
       try{
         // postId from body --->
        const {postId} = req.body;
            // if postId is missing then --->
        if(postId === ''){
              return res.status(400).json({
                 success:false,
                 message:"Post Id Missing."
              });
        };
      //   user from payload --->
        const userDetails = req.user;

        if(!userDetails){
             return res.status(404).json({
                 success:false,
                 message:"User Details missing."
             })
        };
         //  check post by postId and profileId
        const findPost = await Post.findOne({_id:postId,profileId:userDetails.profileId}).populate([{
                     
                     path:"like"
                   },{
                      
                      path:"comment"
                   },{
                     path:"profileId"
                   }]);
      // if not found then -->
        if(!findPost){
              return res.status(404).json({
                  success:false,
                  message:"Post Not Found."
              })
        };
// if found then -->
        return res.status(200).json({
             success:true,
             message:"Post Found.",
             data:{
                 post:findPost
             }
        });


       }catch(err){
         console.error(err);
         return res.status(500).json({
             success:false,
             message:"Problem While getting single Post."
         })
       }
}