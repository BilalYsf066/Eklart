import { AdminLoginForm } from "@/components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-svh place-content-center bg-gray-50">
      <div className="w-full max-w-sm p-6">
         <AdminLoginForm />
      </div>
    </div>
  )
}