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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm text-[#4ea1ff] mb-2 font-roboto font-medium"
          >
            First Name
          </label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={cn(
              "w-full text-sm py-3 px-4 font-roboto",
              errors.firstName ? "border-red-400" : "border-[#4ea1ff]"
            )}
            placeholder="Soeraji"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500 font-roboto">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm text-gray-600 mb-2 font-roboto font-medium"
          >
            Last Name
          </label>
          <Input
            id="lastName"
            {...register('lastName')}
            className="w-full text-sm py-3 px-4 border-gray-300 font-roboto"
            placeholder="Last Name"
          />
        </div>
      </div>

      {/* Phone Number & Country */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2 font-roboto font-medium">
            Code
          </label>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#4ea1ff] text-[#4ea1ff] text-sm font-semibold py-3"
          >
            +62
          </Button>
        </div>
        <div className="col-span-5">
          <label className="block text-sm text-gray-600 mb-2 font-roboto font-medium">
            Phone Number
          </label>
          <Input
            {...register('phoneNumber')}
            className={cn(
              "w-full text-sm py-3 px-4 font-roboto",
              errors.phoneNumber ? "border-red-400" : "border-gray-300"
            )}
            placeholder="Phone Number"
          />
        </div>
        <div className="col-span-5">
          <label className="block text-sm text-gray-600 mb-2 font-roboto font-medium">
            Country
          </label>
          <select
            {...register('country')}
            className={cn(
              "w-full border rounded-md px-4 py-3 text-sm font-roboto",
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
        <p className="text-xs text-red-500 font-roboto">
          {errors.phoneNumber?.message || errors.country?.message}
        </p>
      )}

      {/* Mail Address */}
      <div>
        <label className="block text-sm text-gray-600 mb-2 font-roboto font-medium">
          Email Address
        </label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <Input
            {...register('mailAddress')}
            className="flex-grow border-0 text-sm py-3 px-4 focus:ring-0 font-roboto"
            placeholder="Mail Address"
          />
          <span className="text-gray-600 text-sm pr-4 whitespace-nowrap font-roboto">
            @squareteam.com
          </span>
        </div>
        {errors.mailAddress && (
          <p className="mt-1 text-xs text-red-500 font-roboto">{errors.mailAddress.message}</p>
        )}
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm text-gray-600 mb-2 font-roboto font-medium">
            Password
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className={cn(
              "w-full text-sm py-3 px-4 pr-12 font-roboto",
              errors.password ? "border-red-400" : "border-gray-300"
            )}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="relative">
          <label className="block text-sm text-gray-600 mb-2 font-roboto font-medium">
            Confirm Password
          </label>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register('confirmPassword')}
            className={cn(
              "w-full text-sm py-3 px-4 pr-12 font-roboto",
              errors.confirmPassword ? "border-red-400" : "border-gray-300"
            )}
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-10 text-gray-400"
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
        <p className="text-xs text-red-500 font-roboto">
          {errors.password?.message || errors.confirmPassword?.message}
        </p>
      )}

      {/* About */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-600 font-roboto">
          Tell us about yourself
        </label>
        <textarea
          {...register('about')}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4ea1ff] font-roboto"
          placeholder="Hello my name..."
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 mt-8">
        <Button
          type="button"
          onClick={() => router.push('/login')}
          variant="secondary"
          className="flex-grow bg-[#f0f1f5] text-gray-600 font-semibold py-3 text-base"
        >
          Login
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="flex-grow bg-[#0066ff] text-white font-semibold py-3 text-base"
        >
          {isSubmitting || registerMutation.isPending ? 'Loading...' : 'Register'}
        </Button>
      </div>
    </form>
  )
}