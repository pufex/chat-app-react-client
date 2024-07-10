import type { FieldValues } from "react-hook-form"
import type { ChatType } from "../../../types"
import type { AskToMessagePayload } from "../../../socket-io/types"

import {useForm} from "react-hook-form"
import { useSocket } from "../../../socket-io/Socket"
import { useEffect, useRef } from "react"
import { useAuth } from "../../../auth/Auth"
import { useChats } from "../../../store/store"

import { FormProvider } from "react-hook-form"
import SendMessageButton from "./SendMessageButton"
import Input from "../../../ui/Input"

type MessageFormProps = {
    chat: ChatType,
    listRef: React.RefObject<HTMLDivElement>
}

const MessageForm = ({
    chat,
}: MessageFormProps) => {

    const {auth} = useAuth()
    const {sendMessage} = useSocket()
    const {appendMessage} = useChats()

    const methods = useForm()
    const {handleSubmit, reset} = methods
    const unsubEvents = useRef<Function | undefined>(undefined)

    useEffect(() => {
        const unsubFunction = unsubEvents.current
        if(unsubFunction)
        return () => {
            unsubFunction()
        }
    }, [unsubEvents]) 

    const onSubmit = (data: FieldValues) => {
        if(!auth)
            return
        const {content} = data
        const payload: AskToMessagePayload = {
            chat_id: chat.id,
            content,
            friend_id: chat.users[0].id !== auth.user.id
                ? chat.users[0].id
                : chat.users[1].id
        } 
        sendMessage(
            payload, 
            ({message}) => {
                appendMessage(message)
                reset()
            }
        )
    }

    return <FormProvider {...methods}>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="message-form"
        >
            <Input
                name="content"
                registerOptions={{
                    required: "Required",
                    maxLength: {
                        value: 200,
                        message: "200 char. max."
                    }
                }}
                placeholder="What's on your mind?"
            />
            <SendMessageButton />
        </form>
    </FormProvider>
}

export default MessageForm
