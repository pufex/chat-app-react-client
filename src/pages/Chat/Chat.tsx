import ChatHeader from "./components/ChatHeader"
import MessageForm from "./components/MessageForm"
import MessagesList from "./components/MessagesList"
import { useChats } from "../../store/store"
import { useMemo, useLayoutEffect, useRef } from "react"
import { useParams } from "react-router-dom"

const Chat = () => {

    const {id} = useParams()
    const {chats} = useChats()

    const chat = useMemo(() => !chats
        ? undefined
        : chats.find(chat => chat.id === id)
    , [chats, id])

    const listRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if(listRef.current){
            listRef.current.scrollTo({
                behavior: "instant",
                top: listRef.current.scrollHeight
            })
        }
    }, [chat])

    if(chat)
    return <article className="chat-app">
        <ChatHeader chat={chat} />
        <div 
            className="chat-app__messages"
            ref={listRef}
        >
            <MessagesList chat={chat} />
        </div>
        <MessageForm chat={chat} listRef={listRef}/>
    </article>

    else return null
}

export default Chat
