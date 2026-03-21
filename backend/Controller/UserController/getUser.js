
const Profile = require("../../Model/profileModel");

exports.getUser = async(req,res)=>{
      try{
         
         // profileId from body ->
        const {id} = req.body ;
       

      //   if Id not found  then ->
           if(!id){
              return res.status(400).json({
                 success:false,
                 message:"Profile Id is missing."
              });
           };

         //   if id found then check weather ProfileId is present with the Id or not, if present -> 
           const findProfile = await Profile.findById(id).populate({path:"postId",
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
           }).populate({path:"followingId",populate:{path:"followingTo",model:"Profile"}}).populate({path:"followerId",populate:{
                path:"followBy",
                model:"Profile"
           }}).exec();

         //   if ProfileId not in Profile Doc then ->
         if(!findProfile){
              return res.status(404).json({
                 success:false,
                 message:"Profile Not Found."
              });
         };

        

         // prfile Found then send the response -> 
        return res.status(200).json({
              success:true,
              message:"Profile Found.",
              data:findProfile
        });


      }catch(err){
         // if error ->
          console.error(err);

          return res.status(500).json({
              success:false,
              message:"Problem While getting Profile."
          })
      }
}