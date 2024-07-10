import type { FieldValues } from "react-hook-form"
import type { AuthObjectType } from "./Auth"

import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./Auth"
import { useForm } from "react-hook-form"
import { useState } from "react"

import Button from "../ui/Button"
import Input from "../ui/Input"
import { FormProvider } from "react-hook-form"

import api from "../api/api"
import { isAxiosError } from "axios"

const LoginForm = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const {setAuth} = useAuth()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const methods = useForm()
    const {handleSubmit, formState: {errors}} = methods

    const onSubmit = async (data: FieldValues) => {
        const {email, password} = data
        console.log(email, password)
        setLoading(true)
        setError("")
        try{
            const result = await api.post(
                "/auth/login",
                {email, password},
            )
            const newAuth = result.data as AuthObjectType
            setAuth(newAuth)
            if(location?.state?.previous)
                navigate(location.state.previous)
            else navigate("/")
        }catch(err){
            console.log(err)
            if(isAxiosError(err)){
                if(err.response?.status === 409)
                    setError("Wrong email or password.")
                else setError("Something went wrong...")
            }else setError("Something went wrong...")
            setAuth(null)
        }
        setLoading(false)
    }

    return <section className="login__wrapper">
        <FormProvider {...methods}>   
            <form
                className="login__form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className="heading center login__heading">
                    Login
                </h1>
                {
                    error
                        && <h1 className="heading__error center login__error">
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
                <div className="login__buttons">
                    <Button
                        isLoading={loading}
                        isDisabled={loading}
                    >
                        Log in
                    </Button>
                    <Button
                        role="button"
                        onClick={() => navigate("/register")}
                    >
                        Register First
                    </Button>
                </div>
            </form>
        </FormProvider>
    </section>
}

export default LoginForm
