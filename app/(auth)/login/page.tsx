import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Footer } from '@/components/layout/footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Top white shape */}
      <div className="flex-grow relative">
        {/* Header - Responsive */}
        <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-12 lg:pt-20 text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">Sign In</h1>
          <p className="mt-3 text-gray-500 text-sm lg:text-base">
            Just sign in if you have an account in here. Enjoy our Website
          </p>
        </div>

        {/* Login Card - Responsive */}
        <div className="max-w-xl mx-auto mt-6 lg:mt-10 px-4 lg:px-0">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl relative z-10">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer Link - Responsive */}
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 lg:py-6 text-center text-blue-600 font-semibold text-sm">
        <Link href="/register" className="hover:text-blue-700 transition-colors">
          Don't have a Nodewave account? Sign up
        </Link>
      </div>
      
      {/* Footer */}
      <Footer />

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