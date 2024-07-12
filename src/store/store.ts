import type { 
    ChatType,
    ServerChatType,
    ServerMessageType
} from "../types";
import { create } from "zustand";

type ChatsState = {
    chats: ChatType[] | undefined,
    loadingChats: boolean,
    messagePending: boolean,
    shouldScroll: boolean,

    setShouldScroll: (shouldScroll: boolean) => void,
    setChats: (chats: ServerChatType[]) => void,

    toggleEdited: (chat_id: string, message_id: string) => void
    replaceMessageContent: (chat_id: string, message_id: string, new_content: string) => void

    appendChat: (chat: ServerChatType) => void,

    appendMessage: (message: ServerMessageType) => void,

    makeMessagesRead: (chat_id: string, user_id: string) => void

    makeMessageRemoved: (chat_id: string, user_id: string) => void

    setLoadingChats: (val: boolean) => void,
    setMessagePending: (val: boolean) => void,
}

export const useChats = create<ChatsState>()((set) => ({
    chats: undefined,
    loadingChats: true,
    messagePending: false,
    shouldScroll: true,
    setMessagePending: (messagePending) => set(() => ({messagePending})),
    setShouldScroll: (shouldScroll) => set(() => ({shouldScroll})),
    setChats: (chats) => set(() => ({chats: chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(message => ({
            ...message,
            isEdited: false,
        }))
    }))})),
    toggleEdited: (chat_id, message_id) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : state.chats.map(chat => {
                if(chat.id === chat_id)
                    return {
                        ...chat,
                        messages: chat.messages.map(message => {
                            if(message.id === message_id)
                                return {
                                    ...message,
                                    isEdited: !message.isEdited
                                }
                            return message
                        })
                    }
                return chat
            })
    })),
    replaceMessageContent: (chat_id, message_id, new_content) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : state.chats.map(chat => {
                if(chat.id === chat_id)
                    return {
                        ...chat,
                        last_message: !chat.last_message || chat.last_message.message_id !== message_id
                            ? chat.last_message
                            : {
                                ...chat.last_message,
                                content: new_content
                            },
                        messages: chat.messages.map(message => {
                            if(message.id === message_id)
                                return {
                                    ...message,
                                    wasEdited: true,
                                    content: new_content,
                                }
                            return message
                        })
                    }
                return chat
            })
    })),
    appendChat: (chat) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : [...state.chats, {
                ...chat,
                messages: []
            }]
    })),
    appendMessage: (message) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : state.chats.map((chat) => {
                if(chat.id === message.chat_id)
                    return {
                        ...chat,
                        last_message: {
                            message_id: message.id,
                            content: message.content
                        },
                        messages: [...chat.messages, {
                            ...message,
                            isEdited: false,  
                        }]
                            .sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
                    }
                return chat
            })
    })),
    makeMessagesRead: (chat_id, user_id) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : state.chats.map(chat => {
                if(chat.id === chat_id)
                    return {
                        ...chat,
                        messages: chat.messages.map(message => {
                            if(message.user.id === user_id){
                                return {...message, isRead: true}
                            }
                            return message
                        })
                    }
                return chat
            })
    })),
    makeMessageRemoved: (chat_id, message_id) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : state.chats.map(chat => {
                if(chat.id === chat_id)
                    return {
                        ...chat,
                        last_message: !chat.last_message || chat.last_message.message_id !== message_id
                            ? chat.last_message
                            : {
                                ...chat.last_message,
                                content: null
                            },
                        messages: chat.messages.map(message => {
                            if(message.id === message_id)
                                return {
                                    ...message,
                                    content: null,
                                    isRemoved: true,
                                    isRead: true,
                                }
                            return message
                        })
                    }
                return chat
            }) 
    })),
    setLoadingChats: (loadingChats) => set(() => ({loadingChats}))
}))
