import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgetPassword() {

   

   const [currentValue,setValue] = useState({
      email:"",
      forgetotp:"",
      newPassword:"",
      confirmPassword:""

   });


   const [showEmailForm,setShowEmailForm] = useState(true);
   const [showOtpForm,setShowOtpForm] = useState(false);
   const [showNewPasswordForm,setShowNewPasswordForm] = useState(false);

   const navigate = useNavigate();

   function clickHandler(event){
         const{name,value} = event.target  ;

         setValue(prev =>( {...prev,[name]:value}) );
   }

   async function emailSubmitHandler(event){
       event.preventDefault();
         const dataEmail ={email:currentValue.email}
       try{
        const res = await axios.post(process.env.BACKEND_URL+"/api/v1/forgetPassword",dataEmail,{
            withCredentials: true

        });
           
        console.log(res.data);
        if(res?.data?.success){
               setShowEmailForm(false);
               setShowOtpForm(true);
               toast.success(res.message);
        }

       }catch(err){
           console.error(err);
           toast.warn(err?.res?.data?.message);
       }

   }

   async function otpSubmitHanler(event){
          event.preventDefault();
          
          const otpData = {otp:currentValue.forgetotp}

          try{
               const res = await axios.post(process.env.BACKEND_URL+"/api/v1/verifyOtp",otpData,{
                      withCredentials: true

               });

               if(res?.data?.success){
                    toast.success(res?.data?.message);
                    
                    setShowOtpForm(false);
                    setShowNewPasswordForm(true);
               }
          }catch(err){
             console.error(err);
             toast.warn(err?.res?.data?.message);
          }
   }

   async function passwordSubmithandler(event){
         event.preventDefault();

         const passwordData={password:currentValue.newPassword,confirmPassword:currentValue.confirmPassword}

         try{
            const res = await axios.post(process.env.BACKEND_URL+"/api/v1/setPassword",passwordData,{
                 withCredentials: true

            });

            if(res?.data?.success){
                   toast.success(res?.data?.message);
                   navigate("/");
            }

         }catch(err){
           console.error(err);
           toast.warning(err?.res?.data?.message);
         }
   }
   
 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">

    <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200">

     
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">PostAdda</h1>
        <p className="text-gray-500 text-sm mt-1">Reset your password</p>
      </div>

    
      {showEmailForm && (
        <form onSubmit={emailSubmitHandler} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Enter your email"
            value={currentValue.email}
            name="email"
            onChange={clickHandler}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02]">
            Send OTP
          </button>

        </form>
      )}

      
      {showOtpForm && (
        <form onSubmit={otpSubmitHanler} className="flex flex-col gap-4">

          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            name="forgetotp"
            value={currentValue.forgetotp}
            onChange={clickHandler}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-center tracking-widest text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02]">
            Verify OTP
          </button>

        </form>
      )}

    
      {showNewPasswordForm && (
        <form onSubmit={passwordSubmithandler} className="flex flex-col gap-4">

          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            value={currentValue.newPassword}
            onChange={clickHandler}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={currentValue.confirmPassword}
            onChange={clickHandler}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30 transition hover:scale-[1.02]">
            Update Password
          </button>

        </form>
      )}

    </div>
  </div>
);
}
