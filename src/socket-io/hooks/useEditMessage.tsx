import type { 
    AskToEditMessagePayload,
    ErrorPayload
} from "../types";

import { useSocket } from "../Socket";
import { useCallback } from "react";

export const useEditMessage = () => {

    const {socket} = useSocket()

    const editMessage = useCallback((
        payload: AskToEditMessagePayload,
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

        socket.once("messageEditError", handleError)
        socket.once("messageEditSuccess", handleSuccess)
        socket.emit("askToEditMessage", payload)

    }, [socket])

    return editMessage
}