import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { Footer } from '@/components/layout/footer'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] flex flex-col items-center font-poppins">
      {/* Top Curved Shape */}
      <div className="relative w-full">
        <div className="w-full h-80 bg-white">
          <svg
            className="absolute bottom-0 w-full h-32"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 224L48 213.3C96 203 192 181 288 165.3C384 149 480 139 576 128C672 117 768 107 864 128C960 149 1056 203 1152 213.3C1248 224 1344 192 1392 176L1440 160L1440 320L1392 320C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320L0 320Z"
              fill="#f7f8fb"
            />
          </svg>
        </div>
      </div>

      {/* Register Card - Responsive */}
      <main className="w-full max-w-4xl -mt-32 lg:-mt-40 mx-4 lg:mx-auto bg-white rounded-xl p-6 lg:p-12 shadow-2xl z-10">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-800 text-center mb-2">
          Register
        </h1>
        <p className="text-center text-gray-500 text-xs lg:text-sm mb-6 lg:mb-8 font-roboto">
          Let's Sign up first for enter into Nodewave Website. Uh She Up!
        </p>

        <RegisterForm />
      </main>

      {/* Bottom spacing - Responsive */}
      <div className="py-6 lg:py-8 text-center">
        <Link href="/login" className="text-blue-600 text-sm hover:text-blue-700 font-roboto transition-colors">
          Already have an account? Sign in
        </Link>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}