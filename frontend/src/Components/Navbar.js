import React, { useContext } from 'react'
import { MdOutlineNotifications } from "react-icons/md";
import { SocketContext } from '../ContextAndSocket/SocketContext';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../ContextAndSocket/ContextApi';
import { FaPowerOff } from "react-icons/fa6";



 function Navbar({toShowNotification}) {

     const {count} = useContext(SocketContext);
     
       
     const navigate = useNavigate();


  function logOutHandler (){
         const token = localStorage.getItem("token");
         if(token){
              localStorage.removeItem("token");
              
              navigate("/");
              
         }

         
  }   
   

  return (
    <div className='flex justify-between items-center px-6 py-2 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100'>
        <div>
               <button onClick={logOutHandler} className='p-2 bg-gray-50 rounded-full hover:bg-red-50 group transition-all duration-300'>
                    <FaPowerOff className='text-gray-400 group-hover:text-red-500 transition-colors duration-300 text-xl'/>
               </button>
         </div>
          <div className='p-2 bg-gray-50 rounded-full hover:bg-blue-50 group transition-all duration-300 cursor-pointer'>
           <div className='text-gray-600 group-hover:text-blue-500 transition-colors text-2xl'><MdOutlineNotifications  onClick={toShowNotification} className='text-3xl'/></div>
           {count > 0 && (
                <div className='absolute top-2 right-3 flex items-center justify-center min-w-[20px] h-5 px-[6px] text-[11px] font-bold text-white bg-red-500 border-2 border-white rounded-full animate-bounce-short'>
                    {count > 99 ? '99+' : count}
                </div>
            )}
           </div>
    </div>
  )
}

export default Navbar ;
