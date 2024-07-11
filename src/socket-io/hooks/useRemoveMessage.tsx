import type { 
    AskToRemoveMessagePayload,
    ErrorPayload
} from "../types";

import { useSocket } from "../Socket";
import { useCallback } from "react";

export const useRemoveMessage = () => {

    const {socket} = useSocket()

    const handleSuccess = useCallback((
        payload: AskToRemoveMessagePayload,
        onSuccess?: () => void,
        onError?: (error: ErrorPayload) => void
    ) => {
        if(!socket) return

        const handleSuccess = () => {
            if(onSuccess)
                onSuccess()
        }
        const handleError = (error: ErrorPayload) => {
            if(onError)
                onError(error)
        }
        socket.once("messageRemoveError", handleError)
        socket.once("messageRemoveSuccess", handleSuccess)
        socket.emit("askToRemoveMessage", payload)
    }, [socket])
    
    return handleSuccess
}