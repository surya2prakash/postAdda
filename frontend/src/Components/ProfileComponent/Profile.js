import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../ContextAndSocket/ContextApi'
import ProfileCard from './ProfileCard';
import Card from '../Card';
import { RiCloseCircleLine } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify'
import Loader from '../Loader';
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';

export default function Profile() {
 
    const {loading,details,backendCall,postCount,followerCount,setFollowerCount,
        followingCount,setFollowingCount,posts , followers,
          setFollowers,
          followings,
          setFollowing , setPosts ,setPostCount
    } = useContext(AppContext);

       

       const {id} = useParams();

    const [setectedPost , setSelectedPost] = useState(null);
    
     const [showList,setShowList]=useState(false);
    

     const[setectedfield,setselectedfield] = useState("");
     
     const [tempFollowing,setTempFollowing] = useState([]);
    
       const [unfollowId,setUnfollowId] = useState("");
       const [followBackId,setfollowBackId] = useState("");

       const [name,setName] = useState(null);
       const [image,setImage] = useState(null);
       const [profPosts,setProfPosts]=useState(null);
       const [tposts,setTposts] = useState(null);
       const[tfollower,setTfollower] =useState(null);
       const[tfollowing,setTfollowing] =useState(null);
       const [profFollower,setProfFollower] = useState(null);
       const [profFollowing,setProfFollowing] = useState(null);
       const [isId,setisId]=useState(false); 
    
    useEffect(()=>{

         if(!id){
          setisId(false);
           return;
         }

       let profileId = {
             id:id
       }

           setisId(true);
         async function fetchUserProfile(){
                try{
                  const res = await backendCall({data:profileId,path:`/profile`,method:"post"});
                 
                  if(res.success){
                   console.log(res);
                       setName(res?.data?.fullName);
                       setImage(res?.data?.profileImage);
                       setProfPosts(res?.data?.postId);
                       setTposts(res?.data?.totalPosts);
                       setTfollower(res?.data?.totalFollowers);
                       setTfollowing(res?.data?.totalFollowing);
                       setProfFollower(res?.data?.followerId?.followBy);
                       setProfFollowing(res?.data?.followingId?.followingTo);
                       toast.success(res.message); 
                     
                  }
                }catch(err){
                     console.error(err);
                      toast.warning(err.res.message);  
                }      
              }

              fetchUserProfile();
              // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id]);

  
    function clickFollHandler(e){
          // fetchFollower(); 
          setShowList(true);
          followerAndfollowing();
          const  name = e.currentTarget.dataset.name;
            
          setselectedfield(name);
    }
      // CLOSE FUNCTION WHEN USER CLICK ON CLOSE FOLLOW ICONS
    function clickCloseFollow(){
      setShowList(false);
    }
    
 

  useEffect(()=>{

    if(!unfollowId.trim()){
         
         return ;
    }
      
    unfollowBackCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[unfollowId]);

  

  useEffect(()=>{
         if(!followBackId.trim()){
              
              return;
         }
      
        followBack();
// eslint-disable-next-line react-hooks/exhaustive-deps
  },[followBackId]);

  // FOLLOW BACKEND CALL --->
   async function followBack(){
            try{
              const userId ={userId :followBackId}
                const res = await backendCall({data:userId,path:'/follow',method:'post'});
                  
                if(res?.isError){
                     
                     toast.warning(res?.message);
                     
                };

                if(res?.success){
                     setFollowers(res?.data?.profile?.followerId?.followBy); 
                     setFollowing(res?.data?.profile?.followingId?.followingTo);
                     setFollowingCount(res?.data?.profile?.totalFollowing);
                     setFollowerCount(res?.data?.profile?.totalFollowers);
                     followerAndfollowing();
                     toast.success(res?.data?.message);
                     setfollowBackId("");
                }
            }catch(err){
                console.log(err);
            }
   }

  //  UNFOLLOW FOR BACKEND CALL ---> 
    async function unfollowBackCall(){
            

              const userId ={userId:unfollowId}
                const res = await backendCall({data:userId,path:'/unfollow',method:'post'});
                 
                 
                if(res?.isError){
                     
                     toast.warning(res?.message);
                     
                };

                if(res?.success){
                     setFollowers(res?.data?.follower?.followBy); 
                     setFollowing(res?.data?.following?.followingTo);
                     setFollowingCount(res?.data?.profile?.totalFollowing)
                     setFollowerCount(res?.data?.profile?.totalFollowers)
                     toast.success(res?.data?.message);
                     setUnfollowId("");
                }
            
   };
    // FOLLOW AND FOLLWING FUNCTION FOR FILTER ---->
   async function followerAndfollowing (){
            const userId ={
                userId: details._id 
            }
            const res = await backendCall({data:userId,path:"/followerlist",method:"post"});
            console.log(res);
            if(res.success){
                setTempFollowing(res?.data?.isInFollowing);
            }

   }

     if(loading){
         return <Loader/>
     }


     const profileName = isId ? name : details?.fullName ;
     const profileImage = isId ? image : details?.profileImage ;
     const profilePosts = isId ? profPosts : posts ;
     const profileFollower = isId ? profFollower : followers ;
     const profileFollowing = isId ? profFollowing :followings ;
     const profileTotalFollower = isId ? tfollower : followerCount ;
     const profileTotalFollowing = isId ? tfollowing : followingCount ;
     const profileTotalPosts = isId ? tposts : postCount

    async function deletePostCall (data){
         
           const postId =data?._id

           const token = localStorage.getItem("token");
           
           try{
         const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/delete/${postId}`,{
             headers:{
               Authorization :`Bearer ${token}`
             },
             withCredentials:true
         });
             

             if(res?.data?.success){
                   setPosts(res?.data?.data);
                   setPostCount(res?.data?.data.length);
                   setSelectedPost(null);
                   toast.success(res?.data?.message);
             }
           }catch(err){
             console.log(err);

               toast.warning(err?.response?.data?.message);
           }
    }


  return (
   

     <div className="h-full relative pt-8 flex flex-col overflow-hidden px-4">

      {/* PROFILE  */}
      <div className="flex items-center gap-6 mb-6">
        <div className="p-1 border-2 rounded-full shadow-inner">
          <img
            src={profileImage}
            alt="profile"
            className="w-24 h-24 object-cover rounded-full"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-xl font-semibold">
            {profileName?.toUpperCase()}
          </div>

          <div className="flex gap-6 text-center">
            <div>
              <div className="font-semibold">{profileTotalPosts}</div>
              <div className="text-gray-500 text-sm">posts</div>
            </div>

            <div
              className="cursor-pointer"
              onClick={clickFollHandler}
              data-name="follower"
            >
              <div className="font-semibold">
                {profileTotalFollower}
              </div>
              <div className="text-gray-500 text-sm">followers</div>
            </div>

            <div
              className="cursor-pointer"
              onClick={clickFollHandler}
              data-name="following"
            >
              <div className="font-semibold">
                {profileTotalFollowing}
              </div>
              <div className="text-gray-500 text-sm">following</div>
            </div>
          </div>
        </div>
      </div>

      <hr className="mb-6" />

      {/* POSTS  */}
      <div className="grid grid-cols-3 gap-3 overflow-y-auto">
        {profilePosts.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">
            No Post yet
          </div>
        ) : (  profilePosts?.map((post) => (  <ProfileCard
              key={post._id}
              post={post}
              onClick={() => setSelectedPost(post)}
            />
          ))
        )}
      </div>

      {/* POST  */}
     
{
  setectedPost && (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40  ">
      {/* Container Width Thodi Badi Ki Hai: w-11/12 md:w-3/5 lg:w-2/5 */}
      <div className="relative w-9/12 md:w-3/5 lg:w-3/5 bg-white rounded-xl shadow-lg p-2  ">
        
         
        <div className="absolute top-6 right-5 md:top-6 md:right-6 z-10 flex items-center gap-3 md:gap-4">
          
          {/* Delete Icon*/}
         
         {!isId && (
          <div
            onClick={() => deletePostCall(setectedPost)}
            
          >
            <FaRegTrashAlt className="text-red-500 text-xl md:text-2xl cursor-pointer hover:text-red-700 hover:scale-110 transition-all" />
          </div>
        )}

          {/* Close Icon*/}
          <div onClick={() => setSelectedPost(null)}>
            <RiCloseCircleLine className="text-red-500 text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-all" />
          </div>

        </div>

        
        <Card post={setectedPost} />
        
      </div>
    </div>
  )
}

      {/* FOLLOWER / FOLLOWING MODAL */}

       {showList && (
  <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-[400px] max-h-[500px] bg-white rounded-xl shadow-2xl p-4 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold capitalize text-gray-800">
          {setectedfield}
        </h2>
        <RiCloseCircleLine
          onClick={clickCloseFollow}
          className="text-3xl text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        />
      </div>

      {/* List Container */}
      <div className="overflow-y-auto pr-1 custom-scrollbar">
        {(setectedfield === "follower" ? profileFollower : profileFollowing).length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-medium">
            No Users Found
          </div>
        ) : (
          (setectedfield === "follower" ? profileFollower : profileFollowing).map((user) => (
            
            // Single User Row
            <div
              key={user?._id}
              className="flex items-center justify-between p-2 mb-1 hover:bg-gray-50 rounded-lg transition-colors"
            >
              
              {/* Left : Profile & Name */}
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={user?.profileImage}
                  alt="user"
                  className="w-11 h-11 rounded-full object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="font-semibold text-gray-800 text-sm truncate w-32 md:w-40">
                  {user?.fullName}
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex-shrink-0 ml-2">
                {setectedfield === "follower" ? isId ? (<></>) : (
                  
                      !tempFollowing.includes(user._id) ? (<button
                    onClick={() => setfollowBackId(user?._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-5 rounded-lg text-sm transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    Follow Back
                  </button>) : (null)   
                  
                ) : isId ? (<></>) : (
                  <button
                    onClick={() => setUnfollowId(user?._id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1.5 px-5 rounded-lg text-sm transition-all duration-200 active:scale-95 border border-gray-200"
                  >
                    Unfollow
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
       </div>
       </div>
     )}
     
    </div>
  )
}



