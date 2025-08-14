'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRegister } from '@/lib/hooks/use-auth'

// Schema validation untuk register form
const registerSchema = z.object({
  firstName: z.string().min(1, 'First Name harus diisi'),
  lastName: z.string().min(1, 'Last Name harus diisi'),
  phoneCode: z.string().default('+62'),
  phoneNumber: z.string().min(1, 'Phone Number harus diisi'),
  country: z.string().min(1, 'Country harus dipilih'),
  mailAddress: z.string().min(1, 'Mail Address harus diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Confirm Password harus diisi'),
  about: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const countries = [
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'philippines', label: 'Philippines' },
]

const phoneCodes = [
  { value: '+62', label: '+62', country: 'ID' },
  { value: '+65', label: '+65', country: 'SG' },
  { value: '+60', label: '+60', country: 'MY' },
  { value: '+66', label: '+66', country: 'TH' },
  { value: '+63', label: '+63', country: 'PH' },
]

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerMutation = useRegister()
  
  // Focus states untuk floating labels
  const [firstNameFocused, setFirstNameFocused] = useState(false)
  const [lastNameFocused, setLastNameFocused] = useState(false)
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false)
  const [countryFocused, setCountryFocused] = useState(false)
  const [mailAddressFocused, setMailAddressFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)
  const [aboutFocused, setAboutFocused] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<RegisterFormData>({
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
      about: ''
    }
  })

  // Watch values untuk floating label logic
  const firstNameValue = watch('firstName')
  const lastNameValue = watch('lastName')
  const phoneNumberValue = watch('phoneNumber')
  const countryValue = watch('country')
  const mailAddressValue = watch('mailAddress')
  const passwordValue = watch('password')
  const confirmPasswordValue = watch('confirmPassword')
  const aboutValue = watch('about')
  const phoneCodeValue = watch('phoneCode')

  const onSubmit = async (data: RegisterFormData) => {
    await registerMutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="relative">
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                onFocus={() => setFirstNameFocused(true)}
                onBlur={() => setFirstNameFocused(false)}
                className={`
                  w-full px-3 py-3 text-sm transition-all duration-200 
                  border-2 rounded-lg bg-white
                  focus:outline-none focus:ring-0
                  ${errors.firstName 
                    ? 'border-red-400 focus:border-red-500' 
                    : firstNameFocused 
                      ? 'border-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder=""
              />
              <label
                htmlFor="firstName"
                className={`
                  absolute left-2 px-1 transition-all duration-200 pointer-events-none
                  bg-white text-sm
                  ${firstNameFocused || firstNameValue
                    ? `-top-2 text-xs font-medium ${errors.firstName ? 'text-red-500' : firstNameFocused ? 'text-blue-500' : 'text-gray-600'}`
                    : `top-3 text-gray-400`
                  }
                `}
              >
                First Name
              </label>
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                onFocus={() => setLastNameFocused(true)}
                onBlur={() => setLastNameFocused(false)}
                className={`
                  w-full px-3 py-3 text-sm transition-all duration-200 
                  border-2 rounded-lg bg-white
                  focus:outline-none focus:ring-0
                  ${errors.lastName 
                    ? 'border-red-400 focus:border-red-500' 
                    : lastNameFocused 
                      ? 'border-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder=""
              />
              <label
                htmlFor="lastName"
                className={`
                  absolute left-2 px-1 transition-all duration-200 pointer-events-none
                  bg-white text-sm
                  ${lastNameFocused || lastNameValue
                    ? `-top-2 text-xs font-medium ${errors.lastName ? 'text-red-500' : lastNameFocused ? 'text-blue-500' : 'text-gray-600'}`
                    : `top-3 text-gray-400`
                  }
                `}
              >
                Last Name
              </label>
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Phone Number & Country */}
          <div className="grid grid-cols-12 gap-3">
            {/* Phone Code */}
            <div className="col-span-3 relative">
              <select
                {...register('phoneCode')}
                className="w-full px-2 py-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-blue-500 font-semibold focus:outline-none focus:ring-0 appearance-none"
              >
                {phoneCodes.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none" />
            </div>

            {/* Phone Number */}
            <div className="col-span-5 relative">
              <input
                id="phoneNumber"
                type="text"
                {...register('phoneNumber')}
                onFocus={() => setPhoneNumberFocused(true)}
                onBlur={() => setPhoneNumberFocused(false)}
                disabled
                className={`
                  w-full px-3 py-3 text-sm transition-all duration-200 
                  border-2 rounded-lg bg-gray-100 cursor-not-allowed
                  focus:outline-none focus:ring-0
                  border-gray-200
                `}
                placeholder=""
              />
              <label
                htmlFor="phoneNumber"
                className={`
                  absolute left-2 px-1 transition-all duration-200 pointer-events-none
                  bg-white text-sm
                  ${phoneNumberFocused || phoneNumberValue
                    ? `-top-2 text-xs font-medium ${errors.phoneNumber ? 'text-red-500' : phoneNumberFocused ? 'text-blue-500' : 'text-gray-600'}`
                    : `top-3 text-gray-400`
                  }
                `}
              >
                Phone Number
              </label>
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="col-span-4 relative">
              <select
                id="country"
                {...register('country')}
                onFocus={() => setCountryFocused(true)}
                onBlur={() => setCountryFocused(false)}
                disabled
                className={`
                  w-full px-3 py-3 text-sm transition-all duration-200 
                  border-2 rounded-lg bg-gray-100 appearance-none cursor-not-allowed
                  focus:outline-none focus:ring-0
                  border-gray-200
                `}
              >
                <option value="">Select</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
              <label
                htmlFor="country"
                className={`
                  absolute left-2 px-1 transition-all duration-200 pointer-events-none
                  bg-white text-sm
                  ${countryFocused || countryValue
                    ? `-top-2 text-xs font-medium ${errors.country ? 'text-red-500' : countryFocused ? 'text-blue-500' : 'text-gray-600'}`
                    : `top-3 text-gray-400`
                  }
                `}
              >
                Country
              </label>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              {errors.country && (
                <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Mail Address */}
          <div className="relative">
            <div className="flex">
              <input
                id="mailAddress"
                type="text"
                {...register('mailAddress')}
                onFocus={() => setMailAddressFocused(true)}
                onBlur={() => setMailAddressFocused(false)}
                className={`
                  flex-1 px-3 py-3 text-sm transition-all duration-200 
                  border-2 rounded-l-lg bg-white
                  focus:outline-none focus:ring-0
                  ${errors.mailAddress 
                    ? 'border-red-400 focus:border-red-500' 
                    : mailAddressFocused 
                      ? 'border-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder=""
              />
              <div className="px-3 py-3 bg-gray-50 border-2 border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                @squareteam.com
              </div>
            </div>
            <label
              htmlFor="mailAddress"
              className={`
                absolute left-2 px-1 transition-all duration-200 pointer-events-none
                bg-white text-sm
                ${mailAddressFocused || mailAddressValue
                  ? `-top-2 text-xs font-medium ${errors.mailAddress ? 'text-red-500' : mailAddressFocused ? 'text-blue-500' : 'text-gray-600'}`
                  : `top-3 text-gray-400`
                }
              `}
            >
              Mail Address
            </label>
            {errors.mailAddress && (
              <p className="mt-1 text-xs text-red-500">{errors.mailAddress.message}</p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={`
                  w-full px-3 py-3 pr-10 text-sm transition-all duration-200 
                  border-2 rounded-lg bg-white
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
                  absolute left-2 px-1 transition-all duration-200 pointer-events-none
                  bg-white text-sm
                  ${passwordFocused || passwordValue
                    ? `-top-2 text-xs font-medium ${errors.password ? 'text-red-500' : passwordFocused ? 'text-blue-500' : 'text-gray-600'}`
                    : `top-3 text-gray-400`
                  }
                `}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* Confirm Password */}
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                className={`
                  w-full px-3 py-3 pr-10 text-sm transition-all duration-200 
                  border-2 rounded-lg bg-white
                  focus:outline-none focus:ring-0
                  ${errors.confirmPassword 
                    ? 'border-red-400 focus:border-red-500' 
                    : confirmPasswordFocused 
                      ? 'border-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder=""
              />
              <label
                htmlFor="confirmPassword"
                className={`
                  absolute left-2 px-1 transition-all duration-200 pointer-events-none
                  bg-white text-sm
                  ${confirmPasswordFocused || confirmPasswordValue
                    ? `-top-2 text-xs font-medium ${errors.confirmPassword ? 'text-red-500' : confirmPasswordFocused ? 'text-blue-500' : 'text-gray-600'}`
                    : `top-3 text-gray-400`
                  }
                `}
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* About Textarea */}
          <div className="relative">
            <textarea
              id="about"
              {...register('about')}
              onFocus={() => setAboutFocused(true)}
              onBlur={() => setAboutFocused(false)}
              disabled
              rows={4}
              className={`
                w-full px-3 py-3 text-sm transition-all duration-200 
                border-2 rounded-lg bg-gray-100 resize-none cursor-not-allowed
                focus:outline-none focus:ring-0
                border-gray-200
              `}
              placeholder=""
            />
            <label
              htmlFor="about"
              className={`
                absolute left-2 px-1 transition-all duration-200 pointer-events-none
                bg-white text-sm
                ${aboutFocused || aboutValue
                  ? `-top-2 text-xs font-medium ${aboutFocused ? 'text-blue-500' : 'text-gray-600'}`
                  : `top-3 text-gray-400`
                }
              `}
            >
              Tell us about yourself (Optional)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Link
              href="/login"
              className="flex-1 bg-[#f0f1f5] text-gray-600 font-poppins font-semibold py-3 rounded-lg text-center hover:bg-gray-200 transition-colors"
            >
              Login
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || registerMutation.isPending}
              className={`
                flex-1 py-3 text-white font-poppins font-semibold rounded-lg
                transition-all duration-200 
                ${isSubmitting || registerMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0066ff] hover:bg-[#0051cc] active:bg-[#003d99] hover:shadow-lg'
                }
              `}
            >
              {isSubmitting || registerMutation.isPending ? 'Loading...' : 'Register'}
            </button>
          </div>
    </form>
  )
}