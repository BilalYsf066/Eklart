// src/components/LoginForm.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name] || errors.contact) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        delete newErrors.contact
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Au moins email ou téléphone doit être rempli
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact =
        "Veuillez renseigner votre email ou votre numéro de téléphone"
    }

    // Validation email si rempli
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Format d'email invalide."
    }

    // Validation téléphone si rempli
    if (formData.phone.trim()) {
      const cleanedPhone = formData.phone.replace(/[\s-()]/g, "")
      if (!/^01\d{8}$/.test(cleanedPhone)) {
        newErrors.phone =
          "Le numéro doit être composé de 10 chiffres et commencer par 01."
      }
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire"
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await login(
        formData.email,
        formData.phone,
        formData.password,
        rememberMe
      )

      // Connexion réussie, rediriger
      navigate("/")
    } catch (error: unknown) {
      // Gérer les erreurs de validation du serveur
      const errorObj = error as {
        errors?: Record<string, string>
        message?: string
      }
      if (errorObj.errors) {
        setErrors(errorObj.errors)
      } else {
        setErrors({
          general: errorObj.message || "Erreur lors de la connexion",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Bon retour</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Connectez-vous à votre compte
        </p>
      </div>

      <div className="grid gap-6">
        {/* Erreur générale */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xs p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Message d'erreur pour contact */}
        {errors.contact && (
          <div className="bg-red-50 border border-red-200 rounded-xs p-3">
            <p className="text-red-600 text-sm">{errors.contact}</p>
          </div>
        )}

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="vous@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className={cn(
              "h-10 rounded-xs",
              errors.email ? "border-red-500" : ""
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2 uppercase">
            Ou
          </span>
        </div>

        {/* Téléphone */}
        <div className="grid gap-2">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none border-r pr-3">
              +229
            </span>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0123456789"
              value={formData.phone}
              onChange={handleInputChange}
              className={cn(
                "pl-18 h-10 rounded-xs",
                errors.phone && "border-red-500"
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            className={cn(
              "h-10 rounded-xs",
              errors.password ? "border-red-500" : ""
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Se souvenir de moi
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Mot de passe oublié?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xs h-10"
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Vous n'avez pas de compte ?{" "}
        <Link to="/register" className="hover:text-primary font-medium">
          S'inscrire
        </Link>
      </div>
    </form>
  )
}
