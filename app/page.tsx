// Home page - cuma loading screen karena bakal redirect
// Auto redirect ke dashboard atau login tergantung auth status
// Simple tapi effective - by @RifqiHaikal-2025
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  // This page will be redirected by middleware
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}