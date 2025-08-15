'use client'

import { ArrowLeft, User, Mail, Shield, Calendar, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCurrentUser, useLogout } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
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
      {/* Top Section */}
      <div className="relative bg-white flex justify-center pt-16 pb-20 px-6">
        <div className="absolute top-0 left-0 w-20 h-20 rounded-bl-3xl bg-white" 
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <h1 className="text-3xl font-extrabold text-[#1e3a8a] z-10">Profile</h1>
      </div>

      {/* Main Content */}
      <main className="flex justify-center -mt-12 px-6 pb-20">
        <section 
          className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8"
          style={{ boxShadow: "10px 10px 20px rgba(0,0,0,0.1)" }}
        >
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/todo"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke To-Do
            </Link>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {getInitials(user.name)}
                </div>
                <span
                  aria-label="Online status"
                  className="absolute bottom-0 right-0 block w-4 h-4 rounded-full ring-2 ring-white bg-green-500"
                />
              </div>
              
              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600 capitalize">{user.role} Account</p>
              </div>
            </div>
          </div>

          {/* User Details */}
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

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/todo" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke To-Do
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