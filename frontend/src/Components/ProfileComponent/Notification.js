import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../ContextAndSocket/SocketContext';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../ContextAndSocket/ContextApi';



export default function Notification({data}) {

   

        

   const {setCount} = useContext(SocketContext);
   const {setSelectOnPost,setShowFeed} = useContext(AppContext);

   const navigate = useNavigate();
 
   function userClickHandler(){
      //   user Pe click hua to

      navigate(`/profile/${data?.likedBy?._id}`)
   }

  

   function imageClickHandler() {
  if (data?.post) {
    setSelectOnPost(data.post);
    setShowFeed(false);
  }
}

     useEffect(()=>{
         setCount(0);
     },[setCount])
    
     

  return(
    
    <div className="w-full flex items-center justify-between p-3 mb-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
      
      {data?.success === 'like' ? (
        <>
          {/* Left Side: Profile Pic + Name + Message */}
          <div className="flex items-center gap-3">
            {/* User Profile Image */}
            <div onClick={userClickHandler} className="cursor-pointer flex-shrink-0">
              {data?.likedBy?.profileImage ? (
                <img
                  src={data?.likedBy?.profileImage}
                  alt="user profile"
                  className="h-11 w-11 rounded-full object-cover border border-gray-200"
                />
              ) : (
                // Fallback for no profile image
                <div className="h-11 w-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {data?.likedBy?.fullName?.charAt(0)}
                </div>
              )}
            </div>

          
            <div className="text-sm text-gray-700">
              <span 
                onClick={userClickHandler} 
                className="font-bold text-black cursor-pointer hover:underline"
              >
                {data?.likedBy?.fullName}
              </span>
              <span className="ml-1 text-gray-500">
                {data?.message || 'liked your post.'}
              </span>
            </div>
          </div>

          
          <div onClick={imageClickHandler} className="cursor-pointer flex-shrink-0 ml-4">
            {data?.post?.postImage && (
              <img
                src={data?.post?.postImage}
                alt="post"
                className="h-12 w-12 rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity duration-200"
              />
            )}
          </div>
        </>
      ) : (
      
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-700 font-medium">
            {data?.message}
          </div>
          {data?.post?.postImage && (
            <img
              src={data?.post?.postImage}
              alt="post"
              onClick={imageClickHandler}
              className="h-12 w-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity duration-200 ml-4"
            />
          )}
        </div>
      )}
    </div>
  );
    
}
