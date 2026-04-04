import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../ContextAndSocket/ContextApi';
import { toast } from 'react-toastify';
import Loader from './Loader';


function CreatePost(){

     const myRef = useRef(null);

     const {loading,backendCall,setPosts} = useContext(AppContext);

     const [currentCaption,setCaption] = useState("");
   

     

     function changeHandler(event){           
           setCaption(event.target.value);
     }

     async function submitHandler(event){
        event.preventDefault();

         const file = myRef.current.files[0];
         
         
          if(!file && !currentCaption.trim())
          {
            
             toast.warning("File or caption required");
            return;
          }

          let formData = new FormData();

         

          if( currentCaption){
            formData.append("caption",currentCaption);
          };

          if(file ){
           
            formData.append("file",file);
          };
           
         
             
            const res = await backendCall({data:formData,path:"/create",method:"post"});
               
            if(res?.isError){
                toast.warning(res?.message);
                return;
            }
                
               if(res.success){
                    setCaption("");

                    if(myRef.current){
                       myRef.current.value="";
                    }
                    
                     
                      setPosts(res?.data?.profile?.postId);
                    toast.success(res.message);
               }
                    
          
     }

     if(loading){
        return <Loader/>
     }

    return(
        <div className=' h-full flex  justify-center items-center overflow-hidden relative'>
           {/* POST CREATE FORM */}
        <form onSubmit={submitHandler} className='flex  flex-col justify-center items-center gap-3 lg:flex-row'>
          {/* IMAGE INPUT*/}
            <input type='file' ref={myRef} className='ml-28 lg:ml-0' />
            {/* CAPTION INPUT */}
            <input type='text' placeholder='caption' name='caption' value={currentCaption} onChange={changeHandler} className='border-[2px] rounded-lg border-blue-300 outline-none p-2' />
         <button className='pt-1 pb-1 pl-2 pr-2 border-[2px] rounded-md bg-blue-400  hover:bg-blue-500 transition duration-200 hover:text-white'>Upload</button>
                
        </form>
        </div>
    )
}


export default CreatePost ;

