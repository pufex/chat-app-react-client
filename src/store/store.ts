import type { 
    ChatType,
    MessageType
} from "../types";
import { create } from "zustand";

type ChatsState = {
    chats: ChatType[] | undefined,
    loadingChats: boolean,
    messagePending: boolean,
    shouldScroll: boolean,

    setShouldScroll: (shouldScroll: boolean) => void,
    setChats: (chats: ChatType[]) => void,

    toggleEdited: (chat_id: string, message_id: string) => void
    replaceMessageContent: (chat_id: string, message_id: string, new_content: string) => void

    appendChat: (chat: ChatType) => void,

    appendMessage: (message: MessageType) => void,

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
    setChats: (chats) => set(() => ({chats})),
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
            : [...state.chats, chat]
    })),
    appendMessage: (message) => set((state) => ({
        chats: !state.chats
            ? state.chats
            : state.chats.map((chat) => {
                if(chat.id === message.chat_id)
                    return {
                        ...chat,
                        lastMessage: message.content ?? "Message was removed.",
                        messages: [...chat.messages, message]
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
