const mongoose = require("mongoose");


const likeSchema = new mongoose.Schema({
       postId:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Post",
           required:[true,"Post Id required"]
       },
       likeBy:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"Profile",
             
        }
       ]
       
},{timestamps:true});

module.exports = mongoose.model("Like",likeSchema);