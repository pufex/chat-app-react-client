import type { MessageType } from "../../../types"

import { useAuth } from "../../../auth/Auth"
import { useRef } from "react"

import MessageOptions from "./MessageOptions"
import MessageEditForm from "./MessageEditForm"

import { cn } from "../../../utils/cn"
import { formatDateToTime } from "../../../utils/formatDate"

type MessageBoxProps = {
    message: MessageType,
}

const MessageBox = ({
    message,
}: MessageBoxProps) => {

    const {auth} = useAuth()
    const boxRef = useRef<HTMLDivElement>(null)

    if(auth && !message.isEdited)
    return <div 
        className={cn(
            "message-box__container",
            auth.user.id === message.user.id
                ? "yours"
                : "theirs"
        )}
        ref={boxRef}
    >
        <div className="message-box__wrapper">
            {
                auth.user.id === message.user.id && !message.isRemoved
                    ? <MessageOptions message={message} />
                    : null
            }
            <div 
                className={cn(
                    "message-box",
                    !message.content
                        ? "removed"
                        : ""
                )}
            >
                {
                    !message.content
                        ? "This message was removed by their author."
                        : message.content
                }
            </div>
        </div>
        <label className="message-box__date">
            {formatDateToTime(new Date(message.createdOn))}
        </label>
    </div>

    else if(message.isEdited)
    return <MessageEditForm message={message} />

    else return null
}

export default MessageBox
