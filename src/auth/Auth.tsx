import type { UserType } from "../types";
import { createContext, useContext, useEffect, useState, useLayoutEffect } from "react";
import api from "../api/api";

export type AuthObjectType = {
    user: UserType,
    accessToken: string,
}

export type AuthStateType = AuthObjectType | null | undefined

export type AuthContextType = {
    auth: AuthStateType 
    setAuth: React.Dispatch<React.SetStateAction<AuthStateType>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const authState = useContext(AuthContext)
    if(!authState) throw new Error("useAuth() used outside its provider.")
    return authState
}

type AuthProviderProps = {
    children: React.ReactNode
}

const AuthProvider = ({
    children
}: AuthProviderProps) => {

    const [auth, setAuth] = useState<AuthStateType>(undefined)

    useEffect(() => {
        const fetchAccessToken = async () => {
            try{
                const result = await api.get("/auth/refresh")
                const newAuth = result.data as AuthObjectType
                setAuth(newAuth)
            }catch(err){
                console.log(err)
                setAuth(null)
            }
        }

        fetchAccessToken()
    }, [])

    useLayoutEffect(() => {
        const reqInterceptor = api
            .interceptors
            .request
            .use((config) => {
                config.headers.authorization = auth?.accessToken
                    ? `Bearer ${auth.accessToken}`
                    : config.headers.authorization 
                return config 
            })
        return () => {
            api.interceptors.request.eject(reqInterceptor)
        }
    }, [auth])

    useLayoutEffect(() => {
        const responseInterceptor =  api
            .interceptors
            .response
            .use(
                (result) => result,
                async (error) => {
                    const originalRequest = error.config
                    if(
                        error.response.status === 403
                        && originalRequest._retry 
                    ) {
                        try{
                            const response = await api.get("/auth/refresh")
                            setAuth(response.data)
                            
                            originalRequest.headers.authorization = `Bearer ${response.data.accessToken}`
                            originalRequest._retry = true;
        
                            return api(originalRequest)
                        }catch{
                            setAuth(null)
                        }
                    }
    
                    return Promise.reject(error)
                }
            )

            return () => {
                api.interceptors.response.eject(responseInterceptor)
            }
    }, [auth])

    return <AuthContext.Provider value={{auth, setAuth}}>
        {
            auth === undefined
                ? "Loading..."
                : children
        }
    </AuthContext.Provider>
}

export default AuthProvider
