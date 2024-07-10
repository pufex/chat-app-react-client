import type { ChatType } from "../../../types"

import MessageBox from "./MessageBox"

type MessagesListProps = {
    chat: ChatType
}

const MessagesList = ({
    chat
}: MessagesListProps) => {

    return chat.messages
        .sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
        .map(message => (
            <MessageBox message={message} />
        ))
}

export default MessagesList
