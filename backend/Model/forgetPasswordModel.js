const mongoose = require("mongoose");

const nodemailer = require("nodemailer");

require("dotenv").config();


const forgetPasswordSchema = new mongoose.Schema({
      userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
      },
      email:{
           type:String,
           required:true
      },
    otp:{
          type:Number,
          maxLength:5,
          required:true         
    },
     otpExpireAt:{
              type:Date,
              default: Date.now,
             index: {expires:300}
        }


},{timestamps:true}) ;

forgetPasswordSchema.post("save",async(doc)=>{
         const transporter = nodemailer.createTransport({
               host:process.env.MAIL_HOST,
               auth:{
                  user:process.env.MAIL_USER,
                  pass:process.env.MAIL_PASS

               }
         });

         const info = await transporter.sendMail({
              from:"PostAdda",
              to:doc.email,
              subject:"Forget Password",
              html:`<b>Your Otp</b><br><h2>${doc.otp}</h2>`
         })
});

module.exports = mongoose.model("ForgetPassword",forgetPasswordSchema);