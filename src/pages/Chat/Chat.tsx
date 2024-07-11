import { useChats } from "../../store/store"
import { useMemo, useRef } from "react"
import { useParams } from "react-router-dom"

import ChatHeader from "./components/ChatHeader"
import MessageForm from "./components/MessageForm"
import MessagesList from "./components/MessagesList"

const Chat = () => {

    const listRef = useRef<HTMLDivElement>(null)
    const {id} = useParams()
    const {chats} = useChats()

    const chat = useMemo(() => !chats
        ? undefined
        : chats.find(chat => chat.id === id)
    , [chats, id])

    if(chat)
    return <article className="chat-app">
        <ChatHeader chat={chat} />
        <MessagesList chat={chat} ref={listRef} listRef={listRef}/>
        <MessageForm chat={chat} listRef={listRef} />
    </article>

    else return null
}

export default Chat
