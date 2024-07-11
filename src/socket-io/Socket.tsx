import type { Socket } from "socket.io-client"
import type { SoundStateType } from "../types"
import type { 
    InitSuccessPayload,
    GiveMessagePayload,
    MessagesWereReadPayload,
    MessageRemovedPayload,
    MessageEditedPayload
} from "./types"

import {createContext, useContext, useState, useEffect, useLayoutEffect, useRef} from "react"
import {useAuth} from "../auth/Auth"
import { useChats } from "../store/store"

import ReactPlayer from "react-player"

import io from "socket.io-client"

import Notification from "../assets/sounds/notification-sound.mp3"

export type SocketContextType = {
    socket: Socket | undefined,
    setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>,
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
    
    const notificationRef = useRef<ReactPlayer>(null)
    const [sound, setSound] = useState<SoundStateType>({
        playing: false,
        loop: false,
    });
    const {playing, loop} = sound

    const handleSoundPlay = () => {
        if(notificationRef.current){
            notificationRef.current.seekTo(0, "seconds")
        }
        setSound(prev => ({...prev, playing: true}))
    }
    const handleSoundEnd = () => setSound(prev => ({...prev, playing: false}))


    const [socket, setSocket] = useState<Socket>()
    const {auth, setAuth} = useAuth();
    const {
        chats,
        setLoadingChats, 
        loadingChats,
        appendMessage,
        makeMessagesRead,
        setChats,
        replaceMessageContent,
        makeMessageRemoved
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
            appendMessage({...message, isEdited: false})
            if(message.user.id !== auth.user.id)
                handleSoundPlay()
        }

        const handleMessagesRead = ({chat_id, user_id}: MessagesWereReadPayload) => {
            makeMessagesRead(chat_id, user_id)
        
        }

        const handleMessageEdited = ({chat_id, message_id, new_content}: MessageEditedPayload) => {
            replaceMessageContent(chat_id, message_id, new_content)
        }

        const handleRemovedMessage = ({chat_id, message_id}: MessageRemovedPayload) => {
            makeMessageRemoved(chat_id, message_id)
        }

        const initErrorHandler = () => {
            setAuth(null)
            setLoadingChats(false)
        }

        const initSuccessHandler = ({chats}: InitSuccessPayload) => {
            console.log([...chats].map(chat => ({
                ...chat,
                messages: chat.messages.map(message => ({
                    ...message,
                    isEdited: false 
                }))
            })))
            setChats([...chats].map(chat => ({
                ...chat,
                messages: chat.messages.map(message => ({
                    ...message,
                    isEdited: false 
                }))
            })))
            socket.on("giveMessage", handleGivenMessage)
            socket.on("messagesWereRead", handleMessagesRead)
            socket.on("messageRemoved", handleRemovedMessage)
            socket.on("messageEdited", handleMessageEdited)
            setLoadingChats(false)
        }
        
        socket.once("initError", initErrorHandler)
        socket.once("initSuccess", initSuccessHandler)

        return () => {
            socket.off("initSuccess", initSuccessHandler)
            socket.off("initError", initErrorHandler)
            socket.off("giveMessage", handleGivenMessage)
            socket.off("messagesWereRead", handleMessagesRead)
            socket.off("messageEdited", handleMessageEdited)
            socket.off("messageRemoved", handleRemovedMessage)
        }
    }, [socket])

    return <SocketContext.Provider value={{
        socket, 
        setSocket,
    }}>
        {
            socket === undefined && loadingChats
                ? "Loading..."
                : chats
                    ? <>
                        <ReactPlayer
                            width={0}
                            height={0}
                            playing={playing}
                            loop={loop}
                            url={Notification}
                            ref={notificationRef}
                            onEnded={handleSoundEnd}
                        />
                        {children}
                    </>
                    : "Socket broken :("
        }
    </SocketContext.Provider>
}

export default SocketProvider
