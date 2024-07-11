import type { 
    AskToReadMessagesPayload,
    ReadMessagesSuccess,
    ErrorPayload
  } from "../types"
  
import { useSocket } from "../Socket"
import { useCallback } from "react"
  
export const useReadMessages = () => {
    
    const {socket} = useSocket()
  
    const readMessages = useCallback((
        payload: AskToReadMessagesPayload,
        onSuccess?: (payload: ReadMessagesSuccess) => void,
        onError?: (error: ErrorPayload) => void
    ) => {
        if(!socket) return 

        const handleSuccess = (payload: ReadMessagesSuccess) => {
            if(onSuccess)
                onSuccess(payload)
        }

        const handleError = (error: ErrorPayload) => {
            if(onError)
                onError(error)
        }

        socket.once("readMessagesSuccess", handleSuccess)
        socket.once("readMessagesError", handleError)
        socket.emit("askToReadMessages", payload)
    }, [socket])
    
    return readMessages
}
    