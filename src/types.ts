export type Gender = "Male" | "Female" | "Other" | "Unspecified"

export type UserType = {
    id: string,
    name: string,
    surname: string,
    gender: Gender,
    email: string,
}

export type MessageType = {
    id: string,
    chat_id: string,
    content: string,
    createdOn: Date,
    updatedOn: Date,
    user: UserType
}

export type ChatType = {
    id: string,
    users: UserType[],
    lastMessage?: string,
    messages: MessageType[]
}
