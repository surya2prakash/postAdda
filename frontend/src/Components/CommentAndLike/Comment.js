import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaArrowAltCircleRight } from "react-icons/fa";

import { toast } from 'react-toastify';
import { SocketContext } from '../../ContextAndSocket/SocketContext';
import { AppContext } from '../../ContextAndSocket/ContextApi';
import Loader from '../Loader';



export default function Comment({postComment}) {
 
  

  const postId = postComment?.postId;

  const {currSocket,setCount} = useContext(SocketContext);

  const [comment,setComment] =useState("");

  const [showArrow,setShowArrow] = useState(false);

  const [showComments,setShowComments] = useState([]);
   
  const {loading,details,setShowComment} = useContext(AppContext);
        
     useEffect(()=>{
         setShowComments(postComment?.comments);
         
        
     },[postComment]);

     
    function changeHandler(event){

          const value = event.target.value
            setComment(value);

            if(value.trim() !==""){
                setShowArrow(true);
            }else{
              setShowArrow(false);
            }
    };

    useEffect(()=>{

         if(!currSocket || !postId){
             return;
         }
       currSocket.emit("join-comment",postId);

       const handleNewComment =(data)=>{
               
              setShowComments(prev =>[...prev,...data?.commentDetails]);
       }

       currSocket.on("send-newComment",handleNewComment)
       
        const handleNotification =(data)=>{
          
             setCount(prev=>prev+1);

            }

       currSocket.on("notification",handleNotification)

       return ()=>{
             currSocket.off("send-newComment", handleNewComment);
             currSocket.off("notification", handleNotification);
       }
       // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currSocket,postId]);

   async function submitHandler(event) {
       event.preventDefault();

       if(!comment.trim()){
           return;
       }

       if(currSocket){
          
       
       const   data={
               postId:postId,
               comment:comment
          }
        currSocket.emit("send-comment",data);

        setComment("");
        setShowArrow(false);
       }else{
           toast.warning("Socket is Not Connected.")
       }
    
   }

   const commentEndPoint = useRef(null);

   useEffect(()=>{
         commentEndPoint.current?.scrollIntoView({ behavior: "smooth" });
   },[showComments])

   if(loading){
       return <Loader/>
   }

  return (
    
    <div className='bg-white h-full w-full flex flex-col rounded-t-2xl shadow-2xl'>
      
      
      <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <h3 className='font-semibold text-gray-800'>Comments</h3>
          <button 
            onClick={() => {setShowComment(false)}} 
            className='text-gray-500 hover:text-red-500 font-medium transition-colors text-sm'
          >
            Close
          </button>
      </div>

      
      <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50'>
        {
          showComments?.length === 0 ? (
            <div className='flex justify-center items-center w-full h-full text-gray-400'>
              No Comments Yet...
            </div>
          ) : (
            showComments?.map((comment) => {
              const isMyComment = comment?.commentBy?._id === details._id;

              return ( 
                
                <div key={comment?._id} className={`flex w-full ${isMyComment ? "justify-end" : "justify-start"}`}>
                  
                  {/* Reverse the row order (Avatar <-> Text) if it's my comment */}
                  <div className={`flex items-end gap-2 max-w-[85%] ${isMyComment ? "flex-row-reverse" : "flex-row"}`}>
                    
                    <img 
                      src={comment?.commentBy?.profileImage} 
                      alt='profile' 
                      className='h-8 w-8 rounded-full object-cover flex-shrink-0 mb-1'
                    />
                    
                    <div className={`flex flex-col ${isMyComment ? "items-end" : "items-start"}`}>
                      <div className='text-[11px] text-gray-500 mb-1 mx-1'>
                        {comment?.commentBy?.fullName}
                      </div>
                      
                      
                      <div className={`px-4 py-2 text-[14px] break-words shadow-sm
                        ${isMyComment 
                          ? "bg-blue-500 text-white rounded-2xl rounded-br-sm" // My comment: Blue bubble
                          : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100" // Other's comment: White bubble
                        }
                      `}>
                        {comment?.comment}
                      </div>
                    </div>

                  </div>
                </div>
              )
            })
          )
        }
         <div ref={commentEndPoint}></div>
      </div>

      
      <div className='p-3 border-t border-gray-200 bg-white'>
        <form 
          onSubmit={submitHandler} 
          className='flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition-all'
        >
          <input 
            type='text' 
            placeholder='Write a comment...' 
            onChange={changeHandler} 
            value={comment} 
            className='flex-1 bg-transparent outline-none text-sm text-gray-700'
          />
          {
            showArrow && (
              <button type="submit" className='text-blue-500 hover:text-blue-700 text-xl transition-colors'>
                <FaArrowAltCircleRight />
              </button>
            )
          } 
        </form>
      </div>
      
    </div>
  )
}
