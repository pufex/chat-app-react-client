import type { ChatType } from "../../../types"

import { useAuth } from "../../../auth/Auth"
import { useMemo } from "react"

import JoinChatButton from "./JoinChatButton"
import PingBall from "./PingBall"

import Avatar from "../../../assets/avatar.jpg"

type ChatCellProps = {
    chat: ChatType
}

const ChatCell = ({
    chat
}: ChatCellProps) => {

    const {auth} = useAuth()
    const friend = chat.users.find(user => !auth
        ? false
        : user.id !== auth.user.id
    )

    const unread_count = useMemo(() => {
        if(!auth)
            return 0
        let count = 0;
        for(let i = 0; i < chat.messages.length; i++){
            const message = chat.messages[i]
            if(message.user.id !== auth.user.id && !message.isRead)
                count++;
        }
        return count
    }, [chat])

    if(friend)
    return <div className="chat-cell__container">
        <div className="chat-cell__left">
            <img 
                className="chat-cell__avatar"
                src={Avatar} 
                alt={`${friend.name} ${friend.surname}`} 
            />
            <div className="chat-cell__info">
                <div className="chat-cell__info-top">
                    <h1 className="chat-cell__friend-name"> 
                        {`${friend.name} ${friend.surname}`}
                    </h1>
                    <PingBall count={unread_count} />
                </div>
                <p className="chat-cell__last-message">
                    {
                        chat.last_message
                            ? !chat.last_message.content
                                ? "Message was removed."
                                : chat.last_message.content.length < 50
                                    ? chat.last_message.content
                                    : `${chat.last_message.content.substring(0, 50)}...`
                            : "You should definitely say something!"
                    }
                </p>
            </div>
        </div>
        <JoinChatButton chat_id={chat.id} />
    </div>

    else return null
}

export default ChatCell
