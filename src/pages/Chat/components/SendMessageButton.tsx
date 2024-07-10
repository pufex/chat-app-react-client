import { useChats } from "../../../store/store";
import Button from "../../../ui/Button"
import { IoSendSharp as SendIcon } from "react-icons/io5";
import { CgSpinnerTwo as LoadingIcon } from "react-icons/cg";

const SendMessageButton = () => {

    const {messagePending} = useChats()

    return <Button
        role="submit"
        isDisabled={messagePending}
        className="send-message-button"
    >
        {
            messagePending
                ? <LoadingIcon
                    size={30}
                    className="loading-icon"
                />
                : <SendIcon
                    size={30}
                    className="send-message-button__send-icon"
                />
        }
    </Button>
}

export default SendMessageButton
