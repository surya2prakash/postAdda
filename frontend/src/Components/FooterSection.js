import React, { useContext } from 'react'
import { AiOutlineHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { AppContext } from '../ContextAndSocket/ContextApi';

function FooterSection() {
    
   const {details,setShowComment,setLikePageShow} = useContext(AppContext);

   
    
   
return (
     <div className='w-full bg-white/90 flex justify-around items-center py-1 border-t border-gray-200'>
         
         {/* Home Icon */}
         <Link to={"/main"} className='p-2 text-gray-700 hover:text-blue-500 transition-colors'>
             <AiOutlineHome className='text-3xl'  />
         </Link> 

         {/* Add Post Button  */}
         <Link to="/createpost" className='p-2 text-gray-700 hover:text-blue-500 transition-colors' onClick={()=>{setShowComment(false);setLikePageShow(false) }}>
             <IoMdAdd className='text-3xl'/>
         </Link>              
         
         {/* Profile Image */}
         <Link to="/profile" className='p-2' onClick={()=>{setShowComment(false) ; setLikePageShow(false)}}>
             <div className='h-9 w-9 rounded-full overflow-hidden border border-gray-300'>
                 {details?.profileImage ? (
                     <img 
                         src={details?.profileImage} 
                         alt='profile'  
                         className='h-full w-full object-cover'
                     />
                 ) : (
                     <div className='h-full w-full bg-gray-200'></div>
                 )}
             </div>
         </Link>

     </div>
   )
}

export default FooterSection ;