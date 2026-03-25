const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
       fullName:{
             type:String,
             required:[true,"Name required"],
             trim:true
       },
       email:{
            type:String,
            required:[true,"Email required"],
            unique:true,
            trim:true
       },
       password:{
          type:String,
          required:[true,"Password required."],
          trim:true,
          minLength: 8,
          select:false
       }
},{timestamps:true})


module.exports = mongoose.model("User",userSchema);