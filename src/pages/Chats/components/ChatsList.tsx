import { useChats } from "../../../store/store"

import ChatCell from "./ChatCell"


const ChatsList = () => {

    const {chats} = useChats()

    if(chats)
    return <section className="chats-list">
        {chats.map(chat => <ChatCell chat={chat} />)}
    </section>

    else return null
}

export default ChatsList
