import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"

export function AdminLoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login } = useAdminAuth()
  const [email, setEmail] = useState("admin@eklart.com")
  const [password, setPassword] = useState("Password123!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      // The redirection is handled by AdminAuthContext
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Accès Admin</h1>
        <p className="text-muted-foreground text-sm">Connectez-vous à votre espace.</p>
      </div>
      <div className="grid gap-4">
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </div>
    </form>
  )
}