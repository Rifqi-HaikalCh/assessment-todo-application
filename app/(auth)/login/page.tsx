import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      <div className="flex-grow relative">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-12 lg:pt-20 text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">Sign In</h1>
          <p className="mt-3 text-gray-500 text-sm lg:text-base">
            Just sign in if you have an account in here. Enjoy our Website
          </p>
        </div>

        <div className="max-w-xl mx-auto mt-6 lg:mt-10 px-4 lg:px-0">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl relative z-10">
            <LoginForm />
          </div>
        </div>
      </div>

    </div>
  )
}