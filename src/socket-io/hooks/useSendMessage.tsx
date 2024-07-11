import type { 
  AskToMessagePayload,
  SendMessageSuccessPayload,
  ErrorPayload
} from "../types"

import { useChats } from "../../store/store"
import { useSocket } from "../Socket"
import { useCallback } from "react"

export const useSendMessage = () => {
  
  const {socket} = useSocket()
  const {setMessagePending} = useChats()

  const sendMessage = useCallback((
    payload: AskToMessagePayload, 
    onSuccess?: (payload: SendMessageSuccessPayload) => void, 
    onError?: (error: ErrorPayload) => void
  ) => {
    if(!socket) return

    const handleSuccess = (payload: SendMessageSuccessPayload) => {
        if(onSuccess)
            onSuccess(payload)
        setMessagePending(false)
    }

    const handleError = (error: ErrorPayload) => {
        if(onError)
            onError(error)
        setMessagePending(false)
    }

    socket.once("sendMessageError", handleError)
    socket.once("sendMessageSuccess", handleSuccess)
    setMessagePending(true)
    socket.emit("askToMessage", payload)
  }, [socket, setMessagePending])
  
  return sendMessage
}
