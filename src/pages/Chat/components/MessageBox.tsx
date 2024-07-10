import type { MessageType } from "../../../types"

import { useAuth } from "../../../auth/Auth"

import { cn } from "../../../utils/cn"
import { formatDateToTime } from "../../../utils/formatDate"

type MessageBoxProps = {
    message: MessageType
}

const MessageBox = ({
    message
}: MessageBoxProps) => {

    const {auth} = useAuth()

    if(auth)
    return <div 
        className={cn(
            "message-box__container",
            auth.user.id === message.user.id
                ? "yours"
                : "theirs"
        )}
    >
        <div className="message-box">
            {message.content}
        </div>
        <label className="message-box__date">
            {formatDateToTime(new Date(message.createdOn))}
        </label>
    </div>

    else return null
}

export default MessageBox
