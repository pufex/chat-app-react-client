import React from "react"

import type { Socket } from "socket.io-client"
import type { 
    InitSuccessPayload,
    GiveMessagePayload,
    AskToMessagePayload,
    SendMessageSuccessPayload,
    ErrorPayload
} from "./types"

import {createContext, useContext, useState, useEffect, useLayoutEffect, useCallback} from "react"
import {useAuth} from "../auth/Auth"
import { useChats } from "../store/store"

import io from "socket.io-client"

export type SocketContextType = {
    socket: Socket | undefined,
    setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>,
    sendMessage: (payload: AskToMessagePayload, onSuccess?: (payload: SendMessageSuccessPayload) => void, onError?: (error: ErrorPayload) => void) => () => void
}

const SocketContext = createContext<undefined | SocketContextType>(undefined)

export const useSocket = () => {
    const socketCtx = useContext(SocketContext)
    if(!socketCtx) throw new Error("useSocket() used outside its provider.")
    return socketCtx
}

type SocketProviderProps = {
    children: React.ReactNode 
}

const SocketProvider = ({
    children
}: SocketProviderProps) => {
    
    
    const [socket, setSocket] = useState<Socket>()
    const {auth, setAuth} = useAuth();
    const {
        chats,
        setLoadingChats, 
        loadingChats,
        setMessagePending,
        appendMessage,
        setChats
    } = useChats()

    useEffect(() => {
        if(!auth)
            return 

        const s = io("http://localhost:9000", { auth: {token: auth.accessToken} })
        setSocket(s)
        return () => {
            setSocket(undefined)
            s.disconnect()
        }
    }, [])

    useLayoutEffect(() => {
        if(!socket || !auth)
            return

        setLoadingChats(true)
        
        const handleGivenMessage = ({message}: GiveMessagePayload) => {
            appendMessage(message)
        }

        const initErrorHandler = () => {
            setAuth(null)

            setLoadingChats(false)
        }

        const initSuccessHandler = ({chats}: InitSuccessPayload) => {
            console.log(chats)
            setChats(chats)
            socket.on("giveMessage", handleGivenMessage)

            setLoadingChats(false)
        }
        
        socket.once("initError", initErrorHandler)
        socket.once("initSuccess", initSuccessHandler)

        return () => {
            socket.off("initSuccess", initSuccessHandler)
            socket.off("initError", initErrorHandler)
            socket.off("giveMessage", handleGivenMessage)
        }
    }, [socket])

    const sendMessage = useCallback((
        payload: AskToMessagePayload, 
        onSuccess?: (payload: SendMessageSuccessPayload) => void, 
        onError?: (error: ErrorPayload) => void
    ) => {
        if(!socket)
            return () => {}

        const handleSuccess = (payload: SendMessageSuccessPayload) => {
            console.log("Sended ")
            if(onSuccess)
                onSuccess(payload)
            setMessagePending(false)
        }

        const handleError = (error: ErrorPayload) => {
            console.log("There was a problem sending message...")
            console.log(error)
            if(onError)
                onError(error)
            setMessagePending(false)
        }


        socket.once("sendMessageError", handleError)
        socket.once("sendMessageSuccess", handleSuccess)
        setMessagePending(true)
        socket.emit("askToMessage", payload)
        
        return () => {
            socket.off("sendMessageError", handleError)
            socket.off("sendMessageSuccess", handleSuccess)
        }
    }, [socket])

    return <SocketContext.Provider value={{
        socket, 
        setSocket,
        sendMessage
    }}>
        {
            socket === undefined && loadingChats
                ? "Loading..."
                : chats
                    ? children
                    : "Socket broken :("
        }
    </SocketContext.Provider>
}

export default SocketProvider
