import { createContext,  useContext,  useEffect, useState } from "react";
import { AppContext } from "./ContextApi";

import {io} from 'socket.io-client'




  export const SocketContext = createContext(null);

  const baseUrl = process.env.BACKEND_URL  ;



  
  
  function SocketProvider ({children}){

      const {isLogin} = useContext(AppContext);

    const [currSocket,setSocket] = useState(null);
    const [onlineUser,setOnlineUser] = useState(null);
          
    const[count,setCount] = useState(0);

  

   useEffect(()=>{

    //  ager login true hai to  chlna nhi to waps jao
    

    if(!isLogin){
        // waps jao 
        return;
    }

    

      const token = localStorage.getItem("token");

   const socket = io(`${baseUrl}`,{
      
        auth:{
                token
              }
          });

          setSocket(socket);

          socket.on("connect",()=>{
                  
          });

          socket.on("userDetails",(data)=>{
                setOnlineUser(data);
          });
           
       

          return  () =>{ socket.disconnect()
                 setSocket(null);
                 setOnlineUser(null);
           };
          
   },[isLogin]);

   
       

      return <SocketContext.Provider value={{currSocket,count,setCount}} >{children}</SocketContext.Provider>
          }



export default SocketProvider ;