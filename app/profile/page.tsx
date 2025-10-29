'use client'

import { ArrowLeft, User, Mail, Shield, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCurrentUser, useLogout } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { getInitials } from '@/lib/utils'

export default function ProfilePage() {
  const user = useCurrentUser()
  const logout = useLogout()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#dedede] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#dedede] flex flex-col font-inter">
      <main className="flex-1 flex justify-center py-12 lg:py-20 px-4 lg:px-6">
        <section 
          className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 lg:p-8 h-fit"
          style={{ boxShadow: "10px 10px 20px rgba(0,0,0,0.1)" }}
        >
          <div className="mb-6">
            <Link
              href={user.role === 'admin' ? '/admin' : '/todo'}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {user.role === 'admin' ? 'Kembali ke Admin' : 'Kembali ke To-Do'}
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl lg:text-2xl font-bold">
                  {getInitials(user.name)}
                </div>
                <span
                  aria-label="Online status"
                  className="absolute bottom-0 right-0 block w-4 h-4 lg:w-5 lg:h-5 rounded-full ring-2 ring-white bg-green-500"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600 capitalize text-sm lg:text-base">{user.role} Account</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={user.role === 'admin' ? '/admin' : '/todo'} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {user.role === 'admin' ? 'Kembali ke Admin' : 'Kembali ke To-Do'}
              </Button>
            </Link>
            
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </section>
      </main>
      
    </div>
  )
}