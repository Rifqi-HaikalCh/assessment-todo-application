'use client'

import { useState, forwardRef } from 'react'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useRegister } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  phoneCode: z.string().default('+62'),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  mailAddress: z.string().min(1, 'Mail Address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  about: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  registration: Partial<UseFormRegisterReturn>;
  rightIcon?: React.ReactNode;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, InputProps>((
  { id, label, error, registration, rightIcon, className, ...props }, ref
) => (
  <div className="relative">
    <input
      id={id}
      ref={ref}
      className={cn(
        "peer w-full px-3 py-3 text-sm transition-all duration-200 border-2 rounded-lg bg-white focus:outline-none focus:ring-0 placeholder-transparent disabled:bg-gray-50 disabled:cursor-not-allowed",
        error 
          ? 'border-red-400 focus:border-red-500' 
          : 'border-gray-300 focus:border-blue-500 hover:border-gray-400',
        rightIcon && "pr-10",
        className
      )}
      placeholder={label}
      {...registration}
      {...props}
    />
    <label
      htmlFor={id}
      className={cn(
        "absolute left-2 -top-2.5 px-1 bg-white text-xs font-medium transition-all duration-200 pointer-events-none",
        "peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
        "peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium",
        error ? "text-red-500 peer-focus:text-red-500" : "text-gray-500 peer-focus:text-blue-500"
      )}
    >
      {label}
    </label>
    {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
));
FloatingLabelInput.displayName = 'FloatingLabelInput';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phoneCode: '+62' }
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Row 1: First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="firstName"
          label="First Name"
          type="text"
          registration={register('firstName')}
          error={errors.firstName?.message}
        />
        <FloatingLabelInput
          id="lastName"
          label="Last Name"
          type="text"
          registration={register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      {/* Row 2: Phone & Country */}
      <div className="grid grid-cols-12 gap-x-3">
        <div className="col-span-3 relative">
          <select {...register('phoneCode')} className="w-full px-2 py-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-blue-500 font-semibold focus:outline-none focus:ring-0 appearance-none">
            <option>+62</option>
            <option>+65</option>
            <option>+1</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none" />
        </div>
        <div className="col-span-5">
            <FloatingLabelInput
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              registration={register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />
        </div>
        <div className="col-span-4 relative">
            <select 
                id="country"
                {...register('country')}
                className={cn(
                    "peer w-full px-3 py-3 text-sm transition-all duration-200 border-2 rounded-lg bg-white appearance-none focus:outline-none focus:ring-0 placeholder-transparent",
                    errors.country ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'
                )}
            >
                <option value="" disabled selected></option>
                <option value="indonesia">Indonesia</option>
                <option value="singapore">Singapore</option>
                <option value="usa">USA</option>
            </select>
            <label htmlFor="country" className={cn(
                "absolute left-2 -top-2.5 px-1 bg-white text-xs font-medium transition-all duration-200 pointer-events-none",
                "peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
                "peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium",
                errors.country ? "text-red-500 peer-focus:text-red-500" : "text-gray-500 peer-focus:text-blue-500"
            )}>Your Country</label>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

{/* Row 3: Mail Address */}
<div className="flex w-full">
  <div className="flex-1">
    <FloatingLabelInput
      id="mailAddress"
      label="Mail Address"
      type="text"
      className="h-[50px] rounded-r-none border-r-0 focus:border-blue-500"
      registration={register('mailAddress')}
      error={errors.mailAddress?.message}
    />
  </div>

  <span
    className="inline-flex items-center justify-center h-[50px] px-4 text-sm text-gray-500 bg-gray-50 border-2 border-l-0 border-gray-300 rounded-r-lg flex-shrink-0"
  >
    @squareteam.com
  </span>
</div>


      {/* Row 4: Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          registration={register('password')}
          error={errors.password?.message}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        <FloatingLabelInput
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          registration={register('confirmPassword')}
          error={errors.confirmPassword?.message}
          rightIcon={
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      {/* Row 5: Textarea */}
      <div className="relative">
        <textarea
          id="about"
          rows={3}
          className="peer w-full px-3 py-3 text-sm transition-all duration-200 border-2 rounded-lg bg-white resize-none focus:outline-none focus:ring-0 placeholder-transparent"
          placeholder="Tell us about yourself (Optional)"
          {...register('about')}
        />
        <label
          htmlFor="about"
          className="absolute left-2 -top-2.5 px-1 bg-white text-xs font-medium text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium peer-focus:text-blue-500"
        >
          Tell us about yourself (Optional)
        </label>
      </div>

      {/* Row 6: Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
        <button
          type="button"
          className="w-full sm:w-2/5 bg-[#f0f1f5] text-gray-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Login
        </button>
        <button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="w-full sm:w-3/5 bg-[#0066ff] text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting || registerMutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}