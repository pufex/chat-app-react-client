import type { MessageType } from "../../../types"

import { useState, useEffect, useRef } from "react";

import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import RemoveMessageButton from "./RemoveMessageButton";
import StartEditingButton from "./StartEditingButton";

type MessageOptionsProps = {
    message: MessageType
}

const MessageOptions = ({
    message
}: MessageOptionsProps) => {

    const optionsContainer = useRef<HTMLDivElement>(null)  
    const [show, setShow] = useState(false)
    const toggleOptions = () => setShow(prev => !prev)

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if(optionsContainer.current && !optionsContainer.current.contains(target))
                setShow(false)
        }

        window.addEventListener("click", handleOutsideClick)
        return () => {
            window.removeEventListener("click", handleOutsideClick)
        }
    }, [])

    return <div 
        className="message-options__container"
        ref={optionsContainer}
    >
        <OptionsIcon 
            className="message-options__icon"
            size={20}
            onClick={toggleOptions}
        />
        {
            show
                && <div className="message-options__wrapper">
                    <h1 className="message-options__heading">
                        Options
                    </h1>
                    <ul className="message-options__options">
                        <RemoveMessageButton message={message}/>
                        <StartEditingButton message={message}/>
                    </ul>
                </div>
        }
    </div>
}

export default MessageOptions
