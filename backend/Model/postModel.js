const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
        profileId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"Profile"
        },
        postImage:
            {
              type:String,
             
              trim:true
            },
         caption:{
               type:String,
               trim:true,
               maxLength:60
         },   
        
        like:
            {
              type:mongoose.Schema.Types.ObjectId,
              ref:"Like"
            },
        
        comment:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            },
        totalLike:{
            type:Number,
            default:0
        },
         totalComment:{
            type:Number,
            default:0
       }    
        
},{timestamps:true});

module.exports = mongoose.model("Post",postSchema);