// Form login yang udah gua bikin dengan floating labels
// Pake react-hook-form buat validasi yang smooth
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema'
import { useLogin } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

export function LoginForm() {
  // State buat kontrol tampilan password sama focus effect
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const loginMutation = useLogin()
  
  // Setup form dengan validasi schema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // validasi pake zod schema
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  // Watch values buat floating label animation
  const rememberMe = watch('rememberMe')
  const emailValue = watch('email')
  const passwordValue = watch('password')

  // Submit handler - panggil mutation hook
  const onSubmit = async (data: LoginInput) => {
    await loginMutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email/Username Field */}
      <div className="relative">
        <input
          id="email"
          type="text"
          {...register('email')}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className={`
            w-full px-4 py-4 text-sm transition-all duration-200 
            border-2 rounded-xl bg-white
            focus:outline-none focus:ring-0
            ${errors.email 
              ? 'border-red-400 focus:border-red-500' 
              : emailFocused 
                ? 'border-blue-500' 
                : 'border-gray-300 hover:border-gray-400'
            }
          `}
          placeholder=""
        />
        <label
          htmlFor="email"
          className={`
            absolute left-3 px-2 transition-all duration-200 pointer-events-none
            bg-white text-sm font-medium
            ${emailFocused || emailValue
              ? `-top-2.5 text-xs ${errors.email ? 'text-red-500' : emailFocused ? 'text-blue-500' : 'text-gray-600'}`
              : `top-4 text-gray-400`
            }
          `}
        >
          Your Email / Username
        </label>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          {...register('password')}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          autoComplete="current-password"
          style={{
            WebkitAppearance: 'none'
          } as React.CSSProperties}
          className={`
            w-full px-4 py-4 pr-12 text-sm transition-all duration-200 
            border-2 rounded-xl bg-white
            focus:outline-none focus:ring-0
            [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden
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
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
            className="w-4 h-4"
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
      <Button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-4 text-sm transition-all duration-200"
      >
        {isSubmitting || loginMutation.isPending ? 'Loading...' : 'Login'}
      </Button>
      
      {/* Registration Link */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Don't have a Nodewave account?{' '}
          <Link
            href="/register"
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}