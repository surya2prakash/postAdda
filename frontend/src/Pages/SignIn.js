import React, { useContext, useState } from 'react'
import { AppContext } from '../ContextAndSocket/ContextApi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Components/Loader';

export default function SignIn() {
        
  const navigate = useNavigate();

    const [inputValue,setValue] = useState({
           fullName:"",
           email:"",
           password:"",
           confirmPassword:""
    })


    function changeHandler(event){
           const {name,value} = event.target ;

               setValue((prev)=>({...prev,[name]:value}));
    };

    const {loading,backendCall} = useContext(AppContext);

    

    async function submitHandler(event){
           event.preventDefault();

           
              
            const res = await backendCall({data:inputValue,path:"/sign",method:"post"});

              

            if(res?.isError){
                  toast.error(res?.message);
                  return;
            }
            if(res?.success){
                toast.success(res?.message);
                navigate("/");
            }

          
    }

    if(loading){
        return <Loader/>
    }

  return (
    
    <div className='min-h-screen w-full bg-gray-50 flex flex-col justify-center items-center p-4'>
        
        {/* Form Card Container */}
        <div className='bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-gray-100'>
            
            {/* Header / Title */}
            <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold text-gray-800'>Create Account</h2>
                <p className='text-gray-500 text-sm mt-2'>Join us to get started!</p>
            </div>

            <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                {/* Full Name Input */}
                <input 
                    type="text" 
                    placeholder='Full Name' 
                    name='fullName' 
                    onChange={changeHandler} 
                    value={inputValue.fullName} 
                    className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200' 
                />
                
                {/* Email Input */}
                <input 
                    type="email" 
                    placeholder='Email Address' 
                    name='email' 
                    onChange={changeHandler} 
                    value={inputValue.email} 
                    className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200' 
                />
                
                {/* Password Input */}
                <input 
                    type='password' 
                    placeholder='Password' 
                    name='password' 
                    onChange={changeHandler} 
                    value={inputValue.password} 
                    className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200' 
                />
                
                {/* Confirm Password Input */}
                <input 
                    type='password' 
                    placeholder='Confirm Password' 
                    name='confirmPassword' 
                    onChange={changeHandler} 
                    value={inputValue.confirmPassword} 
                    className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200' 
                />
                
                {/* Submit Button */}
                <button 
                    type="submit"
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-3 mt-2 rounded-xl transition-colors duration-300 shadow-lg shadow-blue-500/30'
                >
                    Sign Up
                </button>
            </form>

           
            <div className='mt-6 text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <Link to="/" className='text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-all'>
                    Log In
                </Link>
            </div>

        </div>
    </div>
  );
}
