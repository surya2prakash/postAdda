const express = require("express");

const router = require("./Router/router");

const cors = require("cors");

const fileUpload = require("express-fileupload");

const dataBase = require("./DataBase/dataBase");

const cloudinaryConnect = require("./DataBase/cloudinary");

const app = express();

const {Server} = require("socket.io");

const http = require("http");

const jwt = require("jsonwebtoken");
const Post = require("./Model/postModel");
const Comment = require("./Model/commentModel");
const Like = require("./Model/likeModel");
const Profile = require("./Model/profileModel");
const cookieParser = require("cookie-parser");
 



require("dotenv").config();
app.use(express.json());

app.use(cookieParser());



app.use(cors({
      origin:"https://postadda.vercel.app" ,
      methods:["POST","GET","PATCH","DELETE"],
      allowedHeaders:["Authorization","Content-Type"],
      credentials:true
}));


app.use(fileUpload(
        {
        useTempFiles:true,
        tempFileDir:'/tmp/'
    }
));

const PORT = process.env.PORT || 4000 ;


dataBase.dataBase();
cloudinaryConnect.cloudinaryConnect();

app.use("/api/v1",router);

 

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
      origin: "https://postadda.vercel.app" ,
      methods:["POST"],
      allowedHeaders:["Authorization","Content-Type"],
      credentials:true
}
});

io.use((socket,next)=>{
     try{

     
    const authHeader = socket.handshake.auth.token;
        
       if(!authHeader){
            return next (new Error("Not Getting Header"));
       };

    //    ager header mil gya to ----->

         const token = authHeader.split(" ").pop();

        

         if(!token){
               return next (new Error("Token is missing."));
         };

        //  token mil gya ab verify kro ;

        const payload =  jwt.verify(token,process.env.JWT_SECRET);

        if(!payload){
             return next (new Error("token not verifyed."));
        };

        socket.user = payload;
        

        next();
     }catch(err){
         console.error(err.message);
     }
    
});

io.on("connection",(socket)=>{
        
        console.log("connected.");
           socket.join(socket?.user?.profileId.toString());
        socket.emit("userDetails",socket.user);
       

        socket.on("join-comment",(postId)=>{
                socket.join(postId);
        });

        socket.on("send-comment",async(data)=>{
          
             try{
                  const postId = data?.postId.toString(); 
                  const comment =data?.comment
               
          const checkPost = await Post.findById(postId);

            if(!checkPost){
                  return;
            };

        

     const updatedComments =   await Comment.findOneAndUpdate({postId:postId},{
                $push:{
                    comments:{
                        comment:comment,
                        commentBy:socket.user.profileId
                    }
                }},{new:true}).populate({
                      path:"comments.commentBy",
                      model:"Profile"
                });

      const post =    await Post.findByIdAndUpdate(postId,{$inc:{totalComment:1}},{new:true}).populate({path:"profileId",
                                     populate:[{
                                          path:"followerId",
                                          populate:{
                                              path:"followBy",
                                              model:"Profile"
                                          }
                                     },
                                     {  
                                        path:"followingId",
                                        populate:{
                                            path:"followingTo",
                                            model:"Profile"
                                        }

                                     }
                                    ]
                                 }).exec();
                
             const latestComment =  updatedComments.comments[updatedComments.comments.length - 1];
          
                io.to(postId.toString()).emit("send-newComment",{
                      message:"New Comment",
                      commentDetails:[latestComment],
                      post:post
                });


                const ownerRoom = checkPost.profileId.toString();
        if (socket?.user?.profileId.toString() !== ownerRoom) {
            io.to(ownerRoom).emit("notification", {
                message: `New comment on your post`,
                post: post
            });
            
        };
               
             }catch(err){
                 console.error(err);
             }
        });

        socket.on("post-like",async(data)=>{
                        const currPostId = data ;
                        
                  try{
                        

                        const postId = currPostId.toString();
                           
                        const userId = socket.user.profileId ;

                        const findPost = await Post.findById({_id:postId});
                       
                             
                       
                               const isAlreadyLike = await Like.findById({_id:findPost.like});
                       
                               if(isAlreadyLike?.likeBy?.includes(userId.toString())){
                         
                                      return ;  
                                      
                               }
                                       
                               const like = await Like.findByIdAndUpdate({_id:findPost.like},{$push:{likeBy:userId}},{new:true});
                       
                                   
                       
                                  
                       
                                 const updatedPost =  await Post.findByIdAndUpdate(postId,{$inc:{totalLike:1}},{new:true}).populate({path:"profileId",
                                     populate:[{
                                          path:"followerId",
                                          populate:{
                                              path:"followBy",
                                              model:"Profile"
                                          }
                                     },
                                     {  
                                        path:"followingId",
                                        populate:{
                                            path:"followingTo",
                                            model:"Profile"
                                        }

                                     }
                                    ]
                                 }).exec();

                           const likeUserDetails = await Profile.findById(userId);
                           
                           const data ={
                               message:"Like Your Post",
                               success:"like",
                               likedBy:likeUserDetails,
                               post:updatedPost
                           };

                           if(userId.toString() !== findPost.profileId.toString()){
                                io.to(findPost.profileId.toString()).emit("send-like",data);
                               
                           }
                          

                  }catch(err){
                      console.error(err);
                  }
        });

        

     socket.on("disconnect",()=>{
          console.log("User Disconnected.")
     })   
});

server.listen(PORT,()=>{
    console.log(`App is listen at http://localhost:${PORT}`)
});

app.get("/",(req,res)=>{
        res.send(`<h2>welcome</h2>`)
})