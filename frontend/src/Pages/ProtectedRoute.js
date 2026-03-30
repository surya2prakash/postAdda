


import React, { useContext } from 'react'
import { AppContext } from '../ContextAndSocket/ContextApi'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {

    const {isLogin} = useContext(AppContext);

    if(!isLogin){
      return <Navigate to="/" replace/>
    };


  return <Outlet/> ;
}
