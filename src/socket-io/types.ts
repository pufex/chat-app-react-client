import type { ServerMessageType, ServerChatType } from "../types"

export type ErrorPayload = {
    status: number, 
    message: string,
}

export type InitSuccessPayload = {
    chats: ServerChatType[]
}

export type GiveMessagePayload = {
    message: ServerMessageType
}

export type MessagesWereReadPayload = {
    chat_id: string,
    user_id: string,
}

export type SendMessageSuccessPayload = {
    message: ServerMessageType
}

export type AskToMessagePayload = {
    chat_id: string,
    content: string,
    friend_id: string
}

export type AskToReadMessagesPayload = {
    chat_id: string,
    friend_id: string,
}

export type ReadMessagesSuccessPayl = {
    chat_id: string,
    message_id: string
}

export type AskToRemoveMessagePayload = {
    message_id: string,
}

export type MessageRemovedPayload = {
    chat_id: string,
    message_id: string
}

export type AskToEditMessagePayload = {
    message_id: string,
    new_content: string,
}

export type MessageEditedPayload = {
    chat_id: string, 
    message_id: string, 
    new_content: string
}