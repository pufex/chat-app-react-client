import { useNavigate } from "react-router-dom";
import Button from "../../../ui/Button"
import { FaArrowLeftLong as LeftArrow} from "react-icons/fa6";
const LeaveChatButton = () => {

    const navigate = useNavigate();

    return <Button
        className="leave-chat-button"
        onClick={() => navigate("/chats")}
    >
        <LeftArrow
            size={30}
            className="leave-chat-button__icon"
        />
    </Button>
}

export default LeaveChatButton
