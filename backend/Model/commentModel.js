const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
       postId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Post"
       },
       comments:[{
        comment: {
        type:String,
       
        trim:true
       },
       commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
       }}],
      

},{timestamps:true});

module.exports=mongoose.model("Comment",commentSchema);