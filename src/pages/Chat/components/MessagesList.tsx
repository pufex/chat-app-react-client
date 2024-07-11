import type { ChatType } from "../../../types"

import { forwardRef, useLayoutEffect } from "react"
import { useReadMessages } from "../../../socket-io/hooks/useReadMessages"
import { useAuth } from "../../../auth/Auth"

import MessageBox from "./MessageBox"


type MessagesListProps = {
    chat: ChatType,
    listRef: React.RefObject<HTMLDivElement>
}

const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>((
    {chat, listRef}, 
    forwardedRef,
    
) => {

    const {auth} = useAuth()
    const readMessages = useReadMessages()
    
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if(!auth)
            return
        const container = e.currentTarget
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = container
        if(scrollHeight - scrollTop - clientHeight < 1){
            const user_id = auth.user.id
            const friend_id = chat.users[0].id !== user_id
                ? chat.users[0].id
                : chat.users[1].id
            const chat_id = chat.id
            if(chat.messages.some(message => !message.isRead))
                readMessages({chat_id, friend_id})
        }
    }


    useLayoutEffect(() => {
        if(listRef.current){
            const {scrollHeight} = listRef.current
            listRef.current.scrollTo({top: scrollHeight})
        }
    }, [])

    return <div 
        className="chat-app__messages"
        onScroll={handleScroll}
        ref={forwardedRef}
    >
        {
            chat.messages
                .sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
                .map(message => (
                    <MessageBox message={message} />
                ))
        }
    </div>
})

export default MessagesList
