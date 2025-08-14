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
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const loginMutation = useLogin()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const rememberMe = watch('rememberMe')
  const emailValue = watch('email')
  const passwordValue = watch('password')

  const onSubmit = async (data: LoginInput) => {
    await loginMutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Input Email/Username */}
      <div className="relative">
        <Input
          id="email"
          type="text"
          {...register('email')}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className={cn(
            "w-full px-4 pt-6 pb-2 text-sm transition-all duration-200",
            errors.email 
              ? "border-red-400 focus:ring-red-400" 
              : "border-blue-400 focus:ring-blue-400"
          )}
          placeholder={emailFocused || emailValue ? "" : ""}
        />
        <label
          htmlFor="email"
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            emailFocused || emailValue
              ? "top-2 text-xs font-medium"
              : "top-4 text-sm",
            errors.email ? "text-red-500" : emailFocused || emailValue ? "text-blue-500" : "text-gray-400"
          )}
        >
          Your Email / Username
        </label>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Input Password */}
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          {...register('password')}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          className={cn(
            "w-full px-4 pt-6 pb-2 pr-10 text-sm transition-all duration-200",
            errors.password 
              ? "border-red-400 focus:ring-red-400" 
              : "border-red-400 focus:ring-red-400"
          )}
          placeholder={passwordFocused || passwordValue ? "" : ""}
        />
        <label
          htmlFor="password"
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            passwordFocused || passwordValue
              ? "top-2 text-xs font-medium"
              : "top-4 text-sm",
            errors.password ? "text-red-500" : passwordFocused || passwordValue ? "text-red-500" : "text-gray-400"
          )}
        >
          Enter Password
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
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
          className="text-blue-500 text-sm font-semibold hover:text-blue-600"
        >
          Forgot Password
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 text-sm"
      >
        {isSubmitting || loginMutation.isPending ? 'Loading...' : 'Login'}
      </Button>
      
      {/* Registration Link */}
      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Already have a Square account?{' '}
          <Link
            href="/register"
            className="text-blue-500 font-semibold hover:text-blue-600"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  )
}