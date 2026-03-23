const mongoose = require("mongoose");

require("dotenv").config();


exports.dataBase = async() =>{

    try{
      
         await  mongoose.connect(process.env.DATABASE_URL);

            console.log("DataBase Connected.");
       }catch(err){
           console.error(err.message);
           process.exit(1);
       }
}