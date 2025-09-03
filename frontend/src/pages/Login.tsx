import Footer from "@/components/Footer"
import { LoginForm } from "@/components/login-form"
import Navbar from "@/components/NavBar"
//import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <div>
      <Navbar />
      <div className="grid min-h-svh">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
