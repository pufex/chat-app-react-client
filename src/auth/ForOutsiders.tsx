import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "./Auth"

const ForOutsiders = () => {
    
    const {auth} = useAuth()
    
    return auth
        ? <Navigate to="/" replace />
        : <Outlet />
}

export default ForOutsiders
