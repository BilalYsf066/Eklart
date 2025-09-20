import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function AdminLoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login } = useAdminAuth()
  const [email, setEmail] = useState("admin@eklart.com")
  const [password, setPassword] = useState("Password123!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      // TODO: Use `rememberMe` to persist auth if backend supports it
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto rounded-xs", className)}>
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Administration Eklart
        </CardTitle>
        <p className="text-muted-foreground">Accès réservé aux administrateurs</p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit} {...props}>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(c) => setRememberMe(!!c)}
              />
              <Label htmlFor="remember" className="text-sm">Se souvenir de moi</Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
          
        </form>
        <div className="mt-6 pt-6 border-t border-muted-foreground">
          <p className="text-xs text-muted-foreground text-center">
            Accès sécurisé réservé aux administrateurs Eklart
          </p>
        </div>
      </CardContent>
    </Card>
  )
}