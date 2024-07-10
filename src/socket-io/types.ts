import type { ChatType, MessageType } from "../types"

export type ErrorPayload = {
    status: number, 
    message: string,
}

export type InitSuccessPayload = {
    chats: ChatType[]
}

export type GiveMessagePayload = {
    message: MessageType
}

export type SendMessageSuccessPayload = {
    message: MessageType
}

export type AskToMessagePayload = {
    chat_id: string,
    content: string,
    friend_id: string
}