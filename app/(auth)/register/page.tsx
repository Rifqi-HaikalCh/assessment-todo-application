import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
          Register
        </h1>
        <p className="text-gray-500 text-sm mt-2 font-roboto">
          Let's Sign up first for enter into Nodewave Website. Uh She Up!
        </p>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 lg:p-12">
        <RegisterForm />

        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-600 text-sm hover:text-blue-700 font-roboto transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}