import React from 'react'
import { AiOutlineLike } from "react-icons/ai";

export default function ProfileCard({post,onClick}) {
 
  return (
    <div className='relative cursor-pointer' onClick={onClick} >
      {/* POST IMAGE */}
             <div>
                  {
                     post?.postImage ? <img src={post?.postImage} alt='no' className='w-full h-40 md:h-52 object-fill' /> : post?.postImage ===null && <div>{post?.caption}</div>
                  }  
              </div>
             <div className='absolute bottom-2 right-2 flex items-center gap-2 bg-black/60 text-white px-2 py-1 rounded'>
              {/* TOTAL LIKE  */}
              <div>{post?.totalLike}</div>
              {/* THUMB ICON */}
              <div><AiOutlineLike /></div>
              </div> 
         
    </div>
  )
}
