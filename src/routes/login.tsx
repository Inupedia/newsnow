import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useToast } from "~/hooks/useToast"

export const Route = createFileRoute("/login")({ component: LoginComponent })

function LoginComponent() {
  const [passcode, setPasscode] = useState<string[]>(Array.from({ length: 6 }).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    // 自动聚焦第一个输入框
    inputRefs.current[0]?.focus()
  }, [])

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPasscode = [...passcode]
    newPasscode[index] = value
    setPasscode(newPasscode)

    // 自动聚焦下一个输入框
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // 验证密码
    if (index === 5 && value) {
      const code = newPasscode.join("")
      if (code === "730601") {
        localStorage.setItem("isAuthenticated", "true")
        navigate({ to: "/" })
      } else {
        toast("密码错误", {
          type: "error",
          duration: 3000,
        })
        setPasscode(Array.from({ length: 6 }).fill(""))
        inputRefs.current[0]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            请输入PASSCODE
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4">
            {passcode.map((digit, index) => (
              <input
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleInput(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl border-2 rounded-lg
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                          dark:bg-gray-800 dark:text-white dark:border-gray-600
                          transition-colors duration-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
