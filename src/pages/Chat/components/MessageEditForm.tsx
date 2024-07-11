import type { FieldValues } from "react-hook-form"
import type { MessageType } from "../../../types"

import { useForm } from "react-hook-form"
import { useEditMessage } from "../../../socket-io/hooks/useEditMessage"
import { useState } from "react"
import { useChats } from "../../../store/store"

import { FormProvider } from "react-hook-form"
import Input from "../../../ui/Input"
import Button from "../../../ui/Button"

type MessageEditFormProps = {
    message: MessageType
}

const MessageEditForm = ({
    message
}: MessageEditFormProps) => {

    const editMessage = useEditMessage()
    const {toggleEdited} = useChats()
    const [isEditing, setEditing] = useState(false)
    const [error, setError] = useState("")

    const applyToggle = () => toggleEdited(message.chat_id, message.id)

    const methods = useForm()
    const {handleSubmit, formState: {errors}} = methods
    const onSubmit = (data: FieldValues) => {
        const {content: new_content} = data
        setEditing(true)
        setError("")
        const message_id = message.id
        editMessage(
            {message_id, new_content},
            () => {
                applyToggle()
            },
            (err) => {
                setError(err.message)
            }
        )
    }

    return <section className="message-edit__modal">
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="message-edit__form"
            >
                <h1 className="heading center message-edit__heading">
                    Edit this message
                </h1>
                {
                    error
                        && <h1 className="heading__error message-edit__error">
                            {error}
                        </h1>
                }
                <Input
                    name="content"
                    registerOptions={{
                        required: "Required",
                        maxLength: {
                            value: 500,
                            message: "500 char. max."
                        }
                    }}
                    defaultValue={message.content ?? undefined}
                    errorMessage={`${errors.content?.message ?? ""}`}
                    placeholder="Your message goes here..."
                >
                    Content
                </Input>
                <div className="message-edit__buttons">
                    <Button
                        role="button"
                        onClick={applyToggle}
                        isDisabled={isEditing}
                    >
                        Discard
                    </Button>
                    <Button
                        isLoading={isEditing}
                        isDisabled={isEditing}
                    >
                        Apply
                    </Button>
                </div>
            </form>
        </FormProvider>
    </section>
}

export default MessageEditForm
