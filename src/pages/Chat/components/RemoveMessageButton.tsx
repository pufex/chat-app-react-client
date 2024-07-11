import type { MessageType } from "../../../types"

import { useRemoveMessage } from "../../../socket-io/hooks/useRemoveMessage";
import { useState } from "react";

import Button from "../../../ui/Button"

type RemoveMessageButtonProps = {
    message: MessageType
}

const RemoveMessageButton = ({
    message
}: RemoveMessageButtonProps) => {
    
    const [isRemoving, setRemoving] = useState(false)
    const removeMessage = useRemoveMessage()

    const handleRemoving = () => {
        const message_id = message.id
        setRemoving(true)
        removeMessage(
            {message_id},
            () => {
                setRemoving(false)
            },
            (err) => {
                console.log(err)
                setRemoving(false)
            }
        )
    }
    
    return <Button
        type="custom"
        role="button"
        onClick={handleRemoving}
        isLoading={isRemoving}
        isDisabled={isRemoving}
        className="remove-message-button"
    >
        {
            isRemoving
                ? "Removing..."
                : "Remove"
        }
    </Button>
}

export default RemoveMessageButton
