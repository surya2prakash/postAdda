import React, {  useContext, useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'

import FooterSection from '../Components/FooterSection'
import {Outlet } from 'react-router-dom'
import Notification from '../Components/ProfileComponent/Notification'
import { SocketContext } from '../ContextAndSocket/SocketContext';


export default function Main() {
    
  const [showNotification,setShowNotification] = useState(false);
    

     function toggleNotification(){
           setShowNotification(!showNotification);
     }

     

     const[showNewNotificaion,setNewNotification] = useState([]);

  const {currSocket,setCount} = useContext(SocketContext);

  useEffect(()=>{

     if(!currSocket){
        return;
     }

    const handleback =(data)=>{
           
           setCount(prev=> prev+1);

           setNewNotification(prev => [data, ...prev]);

          
   }
        currSocket.on("send-like",handleback);
        currSocket.on("notification",handleback);
        return ()=>{
            currSocket.off("send-like",handleback);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
   },[currSocket]);

  
  return (
    <div className='relative min-h-dvh overflow-hidden min-w-dvw grid grid-rows-[auto_1fr_auto] md:mx-[20%]  '>
        
           <nav className='sticky top-0 z-10 bg-slate-400 shadow w-full'>
            <Navbar toShowNotification={toggleNotification}  />
            </nav>
            <main className='min-h-full w-full overflow-y-auto' >
             <Outlet/>
            </main>
            <footer className=' bg-neutral-400 shadow w-full'>
            <FooterSection/>
            </footer>

          {
              showNotification && <div className='absolute top-16 right-5 z-50 max-h-44 w-72 bg-white shadow-xl border rounded-lg p-4 overflow-y-auto overflow-x-hidden'>
                {showNewNotificaion.length === 0 ?(<Notification/>):(showNewNotificaion.map((data,index)=>(
                    <Notification key={index} data={data}/>
                )))}</div>
          }        
    </div>
  )
}
