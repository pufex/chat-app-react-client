import type { FieldValues } from "react-hook-form"
import type { ChatType } from "../../../types"
import type { AskToMessagePayload } from "../../../socket-io/types"

import {useForm} from "react-hook-form"
import { useAuth } from "../../../auth/Auth"
import {useSendMessage} from "../../../socket-io/hooks/useSendMessage"

import { FormProvider } from "react-hook-form"
import SendMessageButton from "./SendMessageButton"
import Input from "../../../ui/Input"

type MessageFormProps = {
    chat: ChatType,
    listRef: React.RefObject<HTMLDivElement>
}

const MessageForm = ({
    chat,
    listRef,
}: MessageFormProps) => {

    const {auth} = useAuth()
    const sendMessage = useSendMessage()
    
    const methods = useForm()
    const {handleSubmit, reset} = methods

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
        sendMessage(payload, () => {
            reset()
            if(listRef.current){
                const {scrollHeight} = listRef.current
                listRef.current.scrollTo({
                    behavior: "instant",
                    top: scrollHeight
                })
            }
        })
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
                        value: 500,
                        message: "500 char. max."
                    }
                }}
                placeholder="What's on your mind?"
            />
            <SendMessageButton />
        </form>
    </FormProvider>
}

export default MessageForm
