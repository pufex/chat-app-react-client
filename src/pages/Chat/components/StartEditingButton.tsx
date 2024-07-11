import type { MessageType } from "../../../types"
import { useChats } from "../../../store/store"
import Button from "../../../ui/Button"

type StartEditingButtonProps = {
    message: MessageType
}

const StartEditingButton = ({
    message
}: StartEditingButtonProps) => {
    
    const {toggleEdited} = useChats()
    
    return <Button
        type="custom"
        role="button"
        onClick={() => toggleEdited(message.chat_id, message.id)}
        className="message-options__button"
    >
        Edit
    </Button>
}

export default StartEditingButton
