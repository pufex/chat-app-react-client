export type Gender = "Male" | "Female" | "Other" | "Unspecified"

export type UserType = {
    id: string,
    name: string,
    surname: string,
    gender: Gender,
    email: string,
}

export type ServerMessageType = {
    id: string,
    chat_id: string,
    content: string | null,
    createdOn: Date,
    updatedOn: Date,
    user: UserType,
    isRead: boolean,
    isRemoved: boolean,
    wasEdited: boolean,
}

export type MessageType = ServerMessageType & {isEdited: boolean}
export type LastMessageType = {
    message_id: string,
    content: string | null
}

export type ServerChatType = {
    id: string,
    users: UserType[],
    last_message: LastMessageType | null,
    messages: ServerMessageType[]
}

export type ChatType = Omit<ServerChatType, "messages"> & {messages: MessageType[]}

export type SoundStateType = {
    playing: boolean,
    loop: boolean,
}

