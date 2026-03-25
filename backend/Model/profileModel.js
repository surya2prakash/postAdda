const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({
       userId :{
           type:mongoose.Schema.Types.ObjectId ,
           ref:"User",
           required:[true,"User Id required"]
       },
       fullName:{
             type:String,
             required:[true,"Name required"],
             trim:true
       },
       postId:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Post"  
        }
       ],
      profileImage:{
           type:String,
           required:[true,"Profile Image required"]
      },
      followerId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Follower"
        } ,
      followingId: {
               type:mongoose.Schema.Types.ObjectId,
               ref:"Following"
          } ,
      totalFollowers:{
          type:Number,
          default:0
      },
      totalFollowing:{
          type:Number,
          default:0
      },
      totalPosts:{
           type:Number,
           default:0
      }
},{timestamps:true});

module.exports = mongoose.model("Profile",profileSchema);