'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

// Schema validation untuk form
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email atau Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
  rememberMe: z.boolean().default(false)
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginFormWithFloatingLabels() {
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
      rememberMe: false
    }
  })

  const emailValue = watch('emailOrUsername')
  const passwordValue = watch('password')
  const rememberMe = watch('rememberMe')

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login data:', data)
    // Implementasi login logic disini
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-20 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Log In</h1>
        <p className="mt-3 text-gray-500 text-sm">
          Just sign in if you have an account in here. Enjoy our Website
        </p>
      </div>

      {/* Login Card */}
      <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="space-y-6">
          {/* Email/Username Field dengan Floating Label */}
          <div className="relative">
            <input
              id="emailOrUsername"
              type="text"
              {...register('emailOrUsername')}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className={`
                w-full px-4 py-4 text-sm transition-all duration-200 
                border-2 rounded-xl bg-white
                focus:outline-none focus:ring-0
                ${errors.emailOrUsername 
                  ? 'border-red-400 focus:border-red-500' 
                  : emailFocused 
                    ? 'border-blue-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
              placeholder=""
            />
            <label
              htmlFor="emailOrUsername"
              className={`
                absolute left-3 px-2 transition-all duration-200 pointer-events-none
                bg-white text-sm font-medium
                ${emailFocused || emailValue
                  ? `-top-2.5 text-xs ${errors.emailOrUsername ? 'text-red-500' : emailFocused ? 'text-blue-500' : 'text-gray-600'}`
                  : `top-4 text-gray-400`
                }
              `}
            >
              Your Email / Username
            </label>
            {errors.emailOrUsername && (
              <p className="mt-1 text-xs text-red-500">{errors.emailOrUsername.message}</p>
            )}
          </div>

          {/* Password Field dengan Floating Label */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register('password')}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`
                w-full px-4 py-4 pr-12 text-sm transition-all duration-200 
                border-2 rounded-xl bg-white
                focus:outline-none focus:ring-0
                ${errors.password 
                  ? 'border-red-400 focus:border-red-500' 
                  : passwordFocused 
                    ? 'border-blue-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
              placeholder=""
            />
            <label
              htmlFor="password"
              className={`
                absolute left-3 px-2 transition-all duration-200 pointer-events-none
                bg-white text-sm font-medium
                ${passwordFocused || passwordValue
                  ? `-top-2.5 text-xs ${errors.password ? 'text-red-500' : passwordFocused ? 'text-blue-500' : 'text-gray-600'}`
                  : `top-4 text-gray-400`
                }
              `}
            >
              Enter Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-gray-600 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setValue('rememberMe', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Remember Me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors"
            >
              Forgot Password
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`
              w-full py-4 text-white font-semibold rounded-xl text-sm
              transition-all duration-200 
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
              }
            `}
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
          
          {/* Registration Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have a Square account?{' '}
              <Link
                href="/register"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="max-w-3xl mx-auto px-6 py-6 text-center text-blue-600 font-semibold text-sm">
        <Link href="/register" className="hover:text-blue-700 transition-colors">
          Don't have a Square account? Sign up
        </Link>
      </div>

      {/* Bottom Wave Shape */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none" style={{ zIndex: 0 }}>
        <svg
          className="w-full h-32"
          viewBox="0 0 1920 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 100C320 50 640 150 960 100C1280 50 1600 150 1920 100V300H0V100Z"
            fill="#FAFBFD"
          />
        </svg>
      </div>
    </div>
  )
}