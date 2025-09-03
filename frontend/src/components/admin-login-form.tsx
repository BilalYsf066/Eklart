import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { ShieldCheck, Lock, Mail } from "lucide-react";

export function AdminLoginForm() {
  const navigate = useNavigate()
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    setError("")

    try {
      await login({
        email: formData.email,
        password: formData.password,
        remember: rememberMe,
      });

      // Connexion réussie, rediriger vers le panneau admin
      navigate("/admin")
    } catch (error: unknown) {
      const errorObj = error as { message?: string }
      setError(errorObj.message || "Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card className="w-full max-w-md shadow-2xl border-0">
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
          <div className="space-y-6">
            {/* Erreur générale */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xs p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@eklart.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11 rounded-xs border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 h-11 rounded-xs border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Se souvenir de moi
              </Label>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-11 rounded-xs bg-primary hover:bg-[#] text-white font-medium"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-muted">
            <p className="text-xs text-muted-foreground text-center">
              Accès sécurisé réservé aux administrateurs Eklart
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
