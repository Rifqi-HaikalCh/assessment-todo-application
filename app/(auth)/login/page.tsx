import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Footer } from '@/components/layout/footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-12">
        {/* Header - Responsive */}
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">Sign In</h1>
          <p className="mt-3 text-gray-500 text-sm lg:text-base">
            Just sign in if you have an account in here. Enjoy our Website
          </p>
        </div>

        {/* Login Card - Responsive */}
        <div className="max-w-xl mx-auto px-4 lg:px-0">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl">
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}