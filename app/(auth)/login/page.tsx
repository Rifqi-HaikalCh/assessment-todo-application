import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Top white shape */}
      <div className="flex-grow relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-6 pt-20 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Sign In</h1>
          <p className="mt-3 text-gray-500 text-sm">
            Just sign in if you have an account in here. Enjoy our Website
          </p>
        </div>

        {/* Login Card */}
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl p-8 shadow-sm relative z-10">
          <LoginForm />
        </div>
      </div>

      {/* Footer Link */}
      <div className="max-w-3xl mx-auto px-6 py-6 text-center text-blue-600 font-semibold text-sm">
        <Link href="/register" className="hover:text-blue-700">
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