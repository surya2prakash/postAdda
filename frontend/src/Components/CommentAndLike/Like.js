import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../ContextAndSocket/ContextApi';

export default function Like() {
    


    const {backendCall,setLikePageShow,setLikeUserList,likeUserList,postIdLike} = useContext(AppContext);

    const post = postIdLike ;

    useEffect(()=>{
      if(!post){
          return;
      }
      console.log("fir bhi chla");
         fetchLikeUser();
    },[post])
      
    async function fetchLikeUser(){
           
      const res = await  backendCall({data:null,path:`/postlike/${post}`,method:"get"});
          
           
           if(res?.success){
             setLikeUserList(res?.data?.like?.likeBy);
             
           }
    }
       
  return (
    <div className="bg-white h-full w-full flex flex-col rounded-t-2xl shadow-2xl">
           <div className='flex justify-between items-center p-4 border-b border-gray-200'>
            {/* LIKES HEADING */}
          <h3 className='font-semibold text-gray-800'>Likes</h3>
          {/* CLOSE BUTTON */}
          <button 
            onClick={() => {setLikePageShow(false)}} 
            className='text-gray-500 hover:text-red-500 font-medium transition-colors text-sm'
          >
            Close
          </button>
      </div>
          {/* SHOW USERS */}
       <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50'>
           {
              likeUserList.length === 0 ? (<div className='flex justify-center items-center w-full h-full text-gray-400'> No Like Yet ..</div>) : (
               likeUserList.map((user)=>(
                    <div key={user?._id}  className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                   <img src={user?.profileImage} alt='profile' className='w-12 h-12 rounded-full object-cover border' />
                   <div className='font-medium text-gray-800'>{user?.fullName}</div>
                  </div>
               )) 
              )
           }
           </div>
    </div>
  )
}
