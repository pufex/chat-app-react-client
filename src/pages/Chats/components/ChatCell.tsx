import type { ChatType } from "../../../types"
import JoinChatButton from "./JoinChatButton"
import { useAuth } from "../../../auth/Auth"
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

    if(friend)
    return <div className="chat-cell__container">
        <div className="chat-cell__left">
            <img 
                className="chat-cell__avatar"
                src={Avatar} 
                alt={`${friend.name} ${friend.surname}`} 
            />
            <div className="chat-cell__info">
                <h1 className="chat-cell__friend-name"> 
                    {`${friend.name} ${friend.surname}`}
                </h1>
                <p className="chat-cell__last-message">
                    {
                        chat.lastMessage
                            ? chat.lastMessage.length < 50
                                ? chat.lastMessage
                                : `${chat.lastMessage.substring(0, 50)}...`
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
