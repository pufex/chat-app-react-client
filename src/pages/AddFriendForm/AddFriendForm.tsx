import type { FieldValues } from 'react-hook-form'
import type { ServerChatType } from '../../types'

import { useChats } from '../../store/store'
import {useForm} from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FormProvider } from 'react-hook-form'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

import api from '../../api/api'
import { isAxiosError } from 'axios'

const AddFriendForm = () => {

    const navigate = useNavigate()
    const {appendChat} = useChats()
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const methods = useForm();
    const {handleSubmit, formState: {errors}} = methods
    
    const onSubmit = async (data: FieldValues) => {
        const {email} = data
        console.log(email)
        setLoading(true)
        setError("")
        try{
            const result = await api.post("/chats", {email})
            const chat = result.data.chat as ServerChatType
            appendChat(chat)
            navigate(`/chats/${chat.id}`)
        }catch(err){
            if(isAxiosError(err)){
                if(err.response?.status === 409){
                    if(err.response.data.code === "same")
                        setError("You can't use your own email address.")
                    else setError("Chat already exists.")
                }
                else if(err.response?.status === 404)
                    setError("There is no user with this email address.")
                else setError("Something went wrong...")
            }else setError("Something went wrong...")
        }

        setLoading(false)
    }

    return <section className="add-friend__wrapper">
        <FormProvider {...methods}>
            <form 
                className="add-friend__form"
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    error
                        && <h1 className="heading__error">
                            {error}
                        </h1>
                }
                <Input
                    name="email"
                    registerOptions={{
                        required: "Required",
                        validate: (val: string) => {
                            const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                            return emailRegex.test(val) || "Invalid email"
                        }         
                    }}
                    errorMessage={`${errors?.email?.message ?? ""}`}
                    placeholder="Enter friend's email address"
                >
                    Email
                </Input>
                <div className="add-friend__buttons">
                    <Button
                        isLoading={isLoading}
                        isDisabled={isLoading}
                    >
                        Create Chat
                    </Button>
                    <Button
                        role="button"
                        onClick={() => navigate("/chats")}
                    >
                        Go back
                    </Button>
                </div>
            </form>
        </FormProvider>
    </section> 
}

export default AddFriendForm 
