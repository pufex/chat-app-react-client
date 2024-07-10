import Button from "../../../ui/Button"
import { useNavigate } from "react-router-dom"

type JoinChatButtonProps = {
    chat_id: string
}

const JoinChatButton = ({
    chat_id
}: JoinChatButtonProps) => {

    const navigate = useNavigate()

    return <Button
        role="button"
        onClick={() => navigate(`/chats/${chat_id}`)}
        className="join-chat-button"
    >
        View
    </Button>
}

export default JoinChatButton
