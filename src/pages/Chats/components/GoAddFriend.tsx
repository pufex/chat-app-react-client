import { useNavigate } from "react-router-dom"
import Button from "../../../ui/Button"

const GoAddFriend = () => {
    
    const navigate = useNavigate()
    
    return <Button
        role="button"
        className="go-add-friend"
        onClick={() => navigate("/chats/new-friend")}
    >
        Add Friend
    </Button>
}

export default GoAddFriend
