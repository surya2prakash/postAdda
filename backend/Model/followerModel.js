const mongoose = require("mongoose");


const followerSchema = new mongoose.Schema({
    followTo:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Profile",
          required:true
    },
    followBy:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"Profile",
             required:true
        }
    ]

},{timestamps:true});

module.exports = mongoose.model("Follower",followerSchema);