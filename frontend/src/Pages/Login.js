import React, { useContext, useState } from 'react'
import { AppContext } from '../ContextAndSocket/ContextApi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Components/Loader';



export default function Login() {
  
          
    const [inputValue,setValue] = useState({
            email:"",
            password:""
    });

     const navigate = useNavigate();

    const {loading,backendCall,setLogin,setDetails} = useContext(AppContext);

   let changeHandler =(event)=>{
          const {name,value} = event.target ;

          setValue((prev)=>({...prev,[name]:value}))
   } ;

 async function submitHandler(event){
         event.preventDefault();
        

         
         const res = await  backendCall({data:inputValue,path:"/login",method:"post"});


         console.log(res);

         if(res?.isError){
              toast.error(res?.message);
            navigate("/sign");
            return;
          }
         
          if(res.success){
                toast.success(res.message);
             
                setLogin(true);
                
                localStorage.setItem("token",res?.data?.token);
                setDetails(res?.data?.profile);
                navigate("/main"); 
          }
    
         
  }

  if(loading){
       return <Loader/>
  }

 return (
  <div className='min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col justify-center items-center p-4'>
    
    {/* 🔥 Logo + Branding Top */}
    <div className='mb-6 text-center'>
      <h1 className='text-4xl font-extrabold text-indigo-600 tracking-tight'>
        PostAdda
      </h1>
      <p className='text-gray-500 text-sm mt-1'>
        Connect • Explore
      </p>
    </div>

    {/* 🔥 Form Card */}
    <div className='bg-white/80 backdrop-blur-md w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-200'>
      
      {/* Header */}
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>Welcome Back 👋</h2>
        <p className='text-gray-500 text-sm mt-1'>Login to continue</p>
      </div>

      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        
        {/* Email */}
        <input 
          type='email' 
          placeholder='Email Address' 
          name='email' 
          onChange={changeHandler} 
          value={inputValue.email} 
          className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200'
        />
        
        {/* Password */}
        <div className='flex flex-col'>
          <input 
            type='password' 
            placeholder='Password' 
            name='password' 
            onChange={changeHandler} 
            value={inputValue.password} 
            className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200'
          />

          <div className='flex justify-end mt-2'>
            <Link to="/forget" className='text-sm text-indigo-500 hover:underline'>
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Button */}
        <button 
          type="submit"
          className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg py-3 mt-2 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:scale-[1.02]'
        >
          Log In
        </button>
      </form>

      {/* Bottom */}
      <div className='mt-6 text-center text-sm text-gray-600'>
        Don't have an account?{' '}
        <Link to="/sign" className='text-indigo-600 font-semibold hover:underline'>
          Create New
        </Link>
      </div>

    </div>
  </div>
);
}
