import type { FieldValues } from "react-hook-form"

import { useNavigate } from "react-router-dom"
import { useAuth } from "./Auth"
import { useForm } from "react-hook-form"
import { useState } from "react"

import Button from "../ui/Button"
import Input from "../ui/Input"
import { FormProvider } from "react-hook-form"

import api from "../api/api"
import { isAxiosError } from "axios"

const RegisterForm = () => {

    const navigate = useNavigate()

    const {setAuth} = useAuth()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const methods = useForm()
    const {handleSubmit, formState: {errors}} = methods

    const onSubmit = async (data: FieldValues) => {
        const {name, surname, email, password} = data
        setLoading(true)
        setError("")
        try{
            await api.post("/auth/register", {name, surname, gender: "Unspecified", email, password})
            navigate("/login")
        }catch(err){
            if(isAxiosError(err)){
                if(err.response?.status === 409)
                    setError("Wrong email or password.")
                else setError("Something went wrong...")
            }else setError("Something went wrong...")
            setAuth(null)
        }
        setLoading(false)
    }

    return <section className="register__wrapper">
        <FormProvider {...methods}>   
            <form
                className="register__form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className="heading center register__heading">
                    Register
                </h1>
                {
                    error
                        && <h1 className="heading__error center register__error">
                            {error}
                        </h1>
                }
                <Input
                    name="name"
                    registerOptions={{
                        required: "Required",
                    }}
                    errorMessage={`${errors?.name?.message ?? ""}`}
                    placeholder="Type your Name..."
                >
                    Name
                </Input>
                <Input
                    name="surname"
                    registerOptions={{
                        required: "Required",
                    }}
                    errorMessage={`${errors?.surname?.message ?? ""}`}
                    placeholder="Type your surname..."
                >
                    Surname
                </Input>
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
                    placeholder="Type your email..."
                >
                    Email
                </Input>
                <Input
                    name="password"
                    registerOptions={{
                        required: "Required",
                        minLength: {
                            message: "6 char. min.",
                            value: 6
                        },
                        maxLength: {
                            message: "30 char. max.",
                            value: 30
                        }
                    }}
                    errorMessage={`${errors?.password?.message ?? ""}`}
                    placeholder="Your password"
                    isPassword
                >
                    Password
                </Input>
                <div className="register-form__buttons">
                    <Button
                        isLoading={loading}
                        isDisabled={loading}
                    >
                        Register
                    </Button>
                    <Button
                        role="button"
                        onClick={() => navigate("/login")}
                    >
                        Go Login
                    </Button>
                </div>
            </form>
        </FormProvider>
    </section>
}

export default RegisterForm
