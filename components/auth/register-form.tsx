'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema'
import { useRegister } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

const countries = [
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'philippines', label: 'Philippines' },
]

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const registerMutation = useRegister()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneCode: '+62',
      phoneNumber: '',
      country: '',
      mailAddress: '',
      password: '',
      confirmPassword: '',
      about: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    await registerMutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs text-[#4ea1ff] mb-1"
          >
            First Name
          </label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={cn(
              "w-full text-sm",
              errors.firstName ? "border-red-400" : "border-[#4ea1ff]"
            )}
            placeholder="Soeraji"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Input
            id="lastName"
            {...register('lastName')}
            className="w-full text-sm border-gray-300"
            placeholder="Last Name"
          />
        </div>
      </div>

      {/* Phone Number & Country */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#4ea1ff] text-[#4ea1ff] text-xs font-semibold"
          >
            +62
          </Button>
        </div>
        <div className="col-span-2">
          <Input
            {...register('phoneNumber')}
            className={cn(
              "w-full text-sm",
              errors.phoneNumber ? "border-red-400" : "border-gray-300"
            )}
            placeholder="Phone Number"
          />
        </div>
        <div>
          <select
            {...register('country')}
            className={cn(
              "w-full border rounded-md px-3 py-2 text-sm",
              errors.country ? "border-red-400" : "border-gray-300"
            )}
          >
            <option value="">Your Country</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {(errors.phoneNumber || errors.country) && (
        <p className="text-xs text-red-500">
          {errors.phoneNumber?.message || errors.country?.message}
        </p>
      )}

      {/* Mail Address */}
      <div>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <Input
            {...register('mailAddress')}
            className="flex-grow border-0 text-sm focus:ring-0"
            placeholder="Mail Address"
          />
          <span className="text-gray-600 text-sm pr-3 whitespace-nowrap">
            @squareteam.com
          </span>
        </div>
        {errors.mailAddress && (
          <p className="mt-1 text-xs text-red-500">{errors.mailAddress.message}</p>
        )}
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className={cn(
              "w-full text-sm pr-10",
              errors.password ? "border-red-400" : "border-gray-300"
            )}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register('confirmPassword')}
            className={cn(
              "w-full text-sm pr-10",
              errors.confirmPassword ? "border-red-400" : "border-gray-300"
            )}
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {(errors.password || errors.confirmPassword) && (
        <p className="text-xs text-red-500">
          {errors.password?.message || errors.confirmPassword?.message}
        </p>
      )}

      {/* About */}
      <div>
        <label className="block text-xs font-semibold mb-1 text-gray-900">
          Tell us about yourself
        </label>
        <textarea
          {...register('about')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4ea1ff]"
          placeholder="Hello my name..."
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          onClick={() => router.push('/login')}
          variant="secondary"
          className="flex-grow bg-[#f0f1f5] text-gray-600 font-semibold"
        >
          Login
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="flex-grow bg-[#0066ff] text-white font-semibold"
        >
          {isSubmitting || registerMutation.isPending ? 'Loading...' : 'Register'}
        </Button>
      </div>
    </form>
  )
}