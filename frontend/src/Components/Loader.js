import React from 'react'

export default function Loader() {

    return(
  // 'animate-pulse' hi wo magic class hai jo loading animation deti hai
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-auto mt-5 animate-pulse border border-gray-100">
      
      {/* Top Section: Fake Profile Image & Name */}
      <div className="flex space-x-4 items-center mb-4">
        {/* Fake Goal Profile Image */}
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        {/* Fake Name and Time */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      
      {/* Middle Section: Fake Post Image */}
      <div className="h-48 bg-gray-200 rounded-xl w-full mb-4"></div>
      
      {/* Bottom Section: Fake Text Lines */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

    </div>
  )
  
}
