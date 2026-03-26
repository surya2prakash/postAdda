const jwt = require("jsonwebtoken");

require("dotenv").config();


exports.auth = async(req,res,next)=>{
           try{

            const authHeaders = req.headers["authorization"]
          

            if(!authHeaders){
                  return res.status(404).json({
                      success:false,
                      message:"Auth Header is missing."
                  })
            };

            const token = authHeaders.split(" ").pop();

            if(!token){
                  return res.status(404).json({
                     success:false,
                     message:"Token is missing."
                  });
            };


            const payload =  jwt.verify(token,process.env.JWT_SECRET);

            
             
            if(!payload){
                  return res.status(400).json({
                     success:false,
                     message:"token Not verifyed."
                  })
            };

            req.user=payload;

            next();


           }catch(err){
             console.error(err);
             return res.status(500).json({
                 success:false,
                 message:"Problem While Auth."
             })
           }
}