import axios from "axios";
import { createContext, useEffect, useState } from "react";



export const AppContext = createContext(null);

function AppContextProvider({children}){

     // if login success full store user details --->
    const [details,setDetails] = useState(null);
//    show  loading -> when we call backend
    const [loading,setLoading] = useState(false);
    // check mark for login -->    
    const [isLogin,setLogin] = useState(false);
//     select post while like or comment
       const[selectOnPost,setSelectOnPost] = useState(null);
     // show feed ---->
     const [showFeed,setShowFeed]  = useState(true);  
    //  show Comment ->
    const [showComment,setShowComment] = useState(false);
    //  totalPost count 
    const [postCount,setPostCount] =useState(0);
    // follower Count -->
    const [followerCount,setFollowerCount] = useState(0);
    // following Count --->
    const [followingCount,setFollowingCount] = useState(0);
    // posts --->
    const [posts,setPosts] = useState([]);
    // followers --->
    const[followers,setFollowers] = useState([]);
    // followings ---->
         const[followings,setFollowing]= useState([]);
        // post like usersList --->
       const [likeUserList,setLikeUserList] = useState([]);
        //like list show --->
        const [likePageShow,setLikePageShow] = useState(false);  
       //postId for like fetch --->
       const [postIdLike,setPostIdLike] = useState("");


    const backendCall = async({data=null,path=null,method=null}) =>{
              
        
              
             const BaseUrl ="http://localhost:5000/api/v1" ;

             let finalUrl =BaseUrl ;

             if(path !== null){
                   finalUrl += path ;
             }

             let token = localStorage.getItem("token");
             
             let headers = {};

             if(token){
                  headers["Authorization"] =`Bearer ${token}`
                    
             }
                  const isFormData = data instanceof FormData;

                  if(!isFormData){
                      headers["Content-Type"]= "application/json"
                  }

            try{
                
                 setLoading(true);
                 let response ;
                 if(method === "post"){
                       response = await  axios.post(`${finalUrl}`,data,{headers});
                 }else{
                     response = await  axios.get(`${finalUrl}`,{headers});
                 }
                 
                 
                 return response?.data;
            }catch(err){
             
                console.error("Backend Error:",err?.response?.data?.message ||err.message);
                  
                return{
                  message:err?.response?.data?.message ,
                  isError:true
                } 
                 
                 
            }finally{
                 setLoading(false);
            }
    }


    
    

    const value ={
          loading,
          isLogin,
          setLogin,
          backendCall,
          details,
          setDetails,
          selectOnPost,
          setSelectOnPost,
          setShowFeed,
          showFeed,
          showComment,
          setShowComment,
          postCount,
          setPostCount,
          followerCount,
          setFollowerCount,
          followingCount,
          setFollowingCount,
          posts,
          setPosts,
          followers,
          setFollowers,
          followings,
          setFollowing,
          likePageShow,
          setLikePageShow,
          likeUserList,
          setLikeUserList,
          postIdLike,
          setPostIdLike
          
    }


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider ;
