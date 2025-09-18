//import React from 'react'
import Navbar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { RegisterForm } from '@/components/register-form'

const Register = () => {
  return (
    <div>
      <Navbar />
      <div className="grid min-h-svh">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  )
}

export default Register