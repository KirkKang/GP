import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const RequireAuth = () => {
    const {isAuthenticated, loadingAuth} = useSelector(state => state.auth);
    console.log("RequireAuth檢查登入狀態",isAuthenticated,"Loading",loadingAuth);

    if (loadingAuth) return <div>載入中...</div>;
    if(!isAuthenticated){
        return <Navigate to='/' replace></Navigate>
    }

  return <Outlet/>
}

export default RequireAuth
