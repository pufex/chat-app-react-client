import type { ChatType } from "../../../types"

import { useAuth } from "../../../auth/Auth"

import LeaveChatButton from "./LeaveChatButton"

import Avatar from "../../../assets/avatar.jpg"

type ChatHeaderProps = {
    chat: ChatType
}

const ChatHeader = ({
    chat
}: ChatHeaderProps) => {
    
    const {auth} = useAuth()
    const friend = chat.users.find(user => !auth
        ? false
        : auth.user.id !== user.id
    )

    if(friend)
    return <header className="chat-header">
        <div className="chat-header__left">
            <LeaveChatButton />
            <div className="chat-header__friend">
                <img 
                    className="chat-header__profile"
                    src={Avatar} 
                    alt={`${friend.name} ${friend.surname}`} 
                />
                <h1 className="chat-header__friend-fullname">
                    {`${friend.name} ${friend.surname}`}
                </h1>
            </div>
        </div>
    </header>
    
    else return null
}

export default ChatHeader
