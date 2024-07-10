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
    appendChat: (chat: ChatType) => void,
    appendMessage: (message: MessageType) => void,
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
                        lastMessage: message.content,
                        messages: [...chat.messages, message]
                            .sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
                    }
                return chat
            })
    })),
    setLoadingChats: (loadingChats) => set(() => ({loadingChats}))
}))
