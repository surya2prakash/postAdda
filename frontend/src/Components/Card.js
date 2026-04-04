import React, { useContext, useEffect, useState } from 'react'

import Like from './CommentAndLike/Like';
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../ContextAndSocket/ContextApi';
import { SocketContext } from '../ContextAndSocket/SocketContext';
import { toast } from 'react-toastify';


export default function Card({post,setCommentStatus,setStoreComment}) {

      
  
    const {details,backendCall,setShowComment,setFollowingCount,setFollowing,setPostIdLike ,  setLikePageShow} = useContext(AppContext);

    
        
    const{currSocket}=useContext(SocketContext) ;

  

  

  const [liked,setLiked] = useState(false);
  
  const [likeCount,setLikeCount] = useState(post?.totalLike || 0);

  const [showFollowBtn,setShowFollowBtn] = useState(false); 

  

  const [followUserId,setFollowUserId] = useState("");

  const navigate = useNavigate();

  function clickCommentHandler(){
     
        setShowComment((prev) => !prev);
        setStoreComment( post.comment)

  };

  function clickLikeHandler(){
        setPostIdLike(post?._id);
        setLikePageShow(true);
         }


 useEffect(() => {
  if (!post || !details){
     return
  };

  
     

  if(post?.profileId?._id.toString() !== details?._id.toString() ){
        setShowFollowBtn(true);
        
  }

  if(details?._id.toString() !== post?.profileId?._id.toString() ){
          const isFollowing = details?.followingId?.followingTo?.some(user=> user?._id.toString()  === post?.profileId?._id.toString() );
      
               
          setShowFollowBtn(!isFollowing);
  }
   
        setFollowUserId(post?.profileId?._id);

  setLiked(post?.like?.likeBy?.includes(details._id));
        
}, [post, details]);



  function handleLike(){
    setLiked(prev =>!prev)
    if(liked){
           fetchUnlike()
           setLikeCount(prev => prev-1);
        }else{
            
             currSocket.emit("post-like",post?._id);
            
             setLikeCount(prev => prev+1)
        }
  }
 
  let likePost ={
       postId:post?._id
  }




async function fetchUnlike(){
       try{
           const res = await backendCall({data:likePost,path:"/unlike",method:"post"})
           
       }catch(err){
           console.error(err);
       }
}

  function profileClickHandler(){
         
          const userId = post?.profileId?._id

          navigate(`/profile/${userId}`)

  }
  
  async function followClickHandler(){
       
              const userId={
                   userId:followUserId
              }
          const res = await backendCall({data:userId,path:"/follow",method:"post"})
           if(res?.isError){
               toast.error(res.message);
               return;
           }
          if(res.success){
           
             setFollowingCount(res?.data?.profile?.totalFollowing);
             setFollowing(res?.data?.following?.followingTo);
             setShowFollowBtn(false);
             toast.success(res.message);
          }

        
  }
  
  return (
    <div className='h-fit w-full mt-1 mb-1 overflow-x-hidden overflow-y-auto'>
      <div className='h-full border-[2px] rounded-md '>
        <div className='max-h-14 p-1 flex justify-between items-center border-b-2'>

            <div className=' flex justify-center items-center' onClick={profileClickHandler}> 
                {/* PROFILE IMAGE */}
              <div className='m-1 p-1 border-2 rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]'>

                  <img src={post?.profileId?.profileImage} alt='no' className='h-9 rounded-full cursor-pointer' />  
         
               </div>
      {/* USER NAME */}
      <div className='ml-2 font-normal text-lg '>
         {
            post?.profileId?.fullName

         }
      </div>

      </div> 
        {/* FOLLOW BUTTON */}
      <div className='ml-auto mr-4'>
             {
               showFollowBtn && <button onClick={followClickHandler} className='border-[2px] pt-1 pb-1 pl-3 pr-3 rounded-md bg-blue-400 hover:bg-blue-500 hover:text-white transition duration-200' >Follow</button>
             } 
      </div>

      </div>
        {/* POST IMAGE */}
      <div className='max-h-[470px] bg-black flex justify-center items-center overflow-hidden'>
           {
            post?.postImage ?(<img src={post?.postImage} alt="noimage" className='w-full max-h-[470px] object-contain'/>):(<div></div>) 
           }    
      </div>
          {/* CAPTION */}
      <div className='min-h-0 m-2 border-b-2'>
           {post?.caption}
      </div>
            {/* LIKE AND UN-LIKE ICONS */}
      <div className='flex justify-between items-center m-1'>
        
             <div className='flex justify-center items-center gap-1'>
             
              <div onClick={handleLike}className='ml-4'>
                        {
                           liked ? (<FcLike className='cursor-pointer text-2xl'/>) : (<FaRegHeart className='cursor-pointer text-2xl '/>)
                         } 
            
                 </div>
            {/* LIKE COUNT */}
            <div onClick={clickLikeHandler}> {likeCount}</div>

            </div>
          
        <div className=' flex justify-center items-center gap-1 mr-4'>  
              {/* COMMENT ICON */}
        <div onClick={clickCommentHandler} ><FaRegComment className='cursor-pointer text-2xl' /></div>
          {/* TOTAL COMMENT */}
        <div className=''>{post.totalComment}</div>

        </div> 
        
      </div>

      </div>
      
      


    </div>
  )
}
