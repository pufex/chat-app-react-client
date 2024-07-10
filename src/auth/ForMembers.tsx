import { Navigate } from "react-router-dom"
import { useAuth } from "./Auth"

import MembersLayout from "../components/MembersLayout"

const ForMembers = () => {
    
    const {auth} = useAuth()
    
    return !auth
        ? <Navigate to="/login" replace />
        : <MembersLayout />
}

export default ForMembers
