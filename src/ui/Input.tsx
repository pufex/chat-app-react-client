import type { RegisterOptions } from "react-hook-form"

import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import { IoMdUnlock as OpenLock } from "react-icons/io";
import { IoMdLock as ClosedLock } from "react-icons/io";

import { cn } from "../utils/cn";

type InputProps = {
    name: string,
    registerOptions?: RegisterOptions,
    errorMessage?: string,
    children?: React.ReactNode,
    placeholder?: string,
    isPassword?: boolean,
    className?: string,
    defaultValue?: string,
}

const Input = ({
    className = "",
    errorMessage,
    children,
    name,
    registerOptions,
    placeholder,
    isPassword,
    defaultValue
}: InputProps) => {

    const inputRef = useRef<HTMLInputElement | null>(null)
    const focusInput = () => inputRef.current?.focus()

    useEffect(() => {
        errorMessage && focusInput()
    }, [errorMessage])

    const {register} = useFormContext()
    const registeredProps = register(name, registerOptions)
    const {ref} = registeredProps

    const [showPassword, setShowPassword] = useState(false)

    return <div 
        className={cn(
            "input__wrapper",
            className
        )}
    >
        {
            errorMessage || children
                ? <div className="input__labels">
                    {
                        children
                            && <label
                                className="input__label"
                                onClick={focusInput}
                            >
                                {children}
                            </label>
                    }
                    {
                        errorMessage
                            && <label 
                                className="input__label--error"
                                onClick={focusInput}
                            >
                                {errorMessage}
                            </label>
                    }
                </div>
                : null
        }
        <div className="input__container">
            <input 
                {...registeredProps}
                className="input__input"
                ref={(e) => {
                    ref(e)
                    inputRef.current = e;
                }}
                placeholder={placeholder}
                type={
                    !isPassword
                        ? "text"
                        : !showPassword
                            ? "password"
                            : "text"
                }
                defaultValue={defaultValue}
            />
            {
                isPassword
                    ? !showPassword
                        ? <ClosedLock 
                            size={25}
                            className="input__lock"
                            onClick={() => setShowPassword(true)}
                        />
                        : <OpenLock 
                            size={25}
                            className="input__lock"
                            onClick={() => setShowPassword(false)}
                        />
                    : null
            }
        </div>
    </div>
}

export default Input
