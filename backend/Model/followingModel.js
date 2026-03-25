const mongoose = require("mongoose");


const followingSchema = new mongoose.Schema({
    followingBy:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Profile"
    },
    followingTo:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"Profile"
        }
    ]

},{timestamps:true});


module.exports = mongoose.model("Following",followingSchema);