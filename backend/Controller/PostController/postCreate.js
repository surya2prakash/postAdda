const Post = require("../../Model/postModel");

const Profile = require("../../Model/profileModel");

const cloudinary = require("cloudinary").v2;

const Like = require("../../Model/likeModel");

const Comment = require("../../Model/commentModel");

// check image support type function --->
const isSupport =(fileType,supportType)=>{
    //   if  image into the support type then return true --->
      if(supportType.includes(fileType)){
           return true;
      }else{
        // if not support then return false  --->
        return false;
      }
      
};

// image upload function --->
const uploadFile = async(imageFile,folder,resource_type="auto")=>{
        try{
            //   image ,folder name , resourse_type
            const options ={
                  folder,resource_type:resource_type
            };
            
            let result = await cloudinary.uploader.upload(imageFile.tempFilePath,options);
            //   return the result --->
            return result;

        }catch(err){
            console.error(err);
        }
}


exports.postCreate = async(req,res) =>{
       try{

        //   user from payload
        const userDetails = req.user ;
        // caption & image from body ---->
        const caption = req.body?.caption ?? "" ;
         
        const imageFile = req.files?.file || null;
        
       
        //  checking user is in profile doc -->
         const findProfile = await Profile.findById(userDetails.profileId);

            if(!findProfile){
                   return res.status(400).json({
                     success:false,
                     message:"Profile Not Found."
                   });
            };

            // if not imageFile and not caption then --->
        if(!imageFile && !caption?.trim()){
            return res.status(400).json({
                 success:false,
                 message:"Select the photo field."
            })
        };
            
        // if only Caption then ---->
        if(!imageFile && caption?.trim()){
             return res.status(400).json({
                  success:false,
                  message:"Text Post Not Allowed."
             })
        }
          
        //  image type ---->
        const supportType = ["jpg","png","jpeg"]

        let imageUrl = null ;

        if(imageFile ){
            const fileType = imageFile.name.split(".").pop().toLowerCase();
            // check that image is into to supportType or not----->
            if(!isSupport(fileType,supportType)){
                return res.status(400).json({
                      success:false,
                      message:"Image File Not Support."
                })
            }

        // for uploading the image on cloudinary ---->   
            const uploadImage = await  uploadFile(imageFile,"image");
            //  if not then show the problem
            if(!uploadImage){
                  return res.status(400).json({
                     success:false,
                     message:"Problem While Uploading."
                  })
            }


           
            //   store the image url from cloudinary---->
              imageUrl = uploadImage.secure_url;
          
           
        }

        let newPost ;
            // if only image then create post --->
          if(!caption){
                 newPost = new Post({
                     profileId:findProfile._id,
                      postImage:imageUrl,
                       
            });
             await newPost.save();
          }
        //   if caption then create post --->
          if(caption){
              newPost = new Post({
                     profileId:findProfile._id,
                      postImage:imageUrl,
                      caption:caption, 
            });

            await newPost.save();
          }
        
        // create doc for like, comment ------>
          const likes =  new Like({
                 postId:newPost._id
            });

            await likes.save();

           const comments = new Comment({
                 postId:newPost._id
            });

            await comments.save();

            const currentPost =   await Post.findByIdAndUpdate({_id:newPost._id},{like:likes._id,comment:comments._id},{new:true});

            // increase totalpost count by 1 --->
             const updateProfile = await Profile.findByIdAndUpdate({_id:findProfile.id},{$inc:{totalPosts:1},$push:{postId:newPost._id}},{new:true}).populate({path:"postId",
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
            return res.status(201).json({
                 success:true,
                 message:"Post.",
                 data:{
                     post:currentPost,
                     profile:updateProfile
                 }
            })
        

       }catch(err){
             console.error(err);
             return res.status(500).json({
                 success:false,
                 message:"Problem while Post Create."
             })
       }
}

