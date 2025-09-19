// Formulaire d'enregistrement
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { type RegisterData } from "@/services/authService"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isArtisan, setIsArtisan] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    description: "",
    identityDocument: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, identityDocument: file }))
    if (errors.identityDocument) {
      setErrors((prev) => ({ ...prev, identityDocument: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validation des champs obligatoires
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est obligatoire"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est obligatoire"
    }

    // Au moins email ou téléphone doit être rempli
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact =
        "Veuillez renseigner au moins votre email ou votre numéro de téléphone"
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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas."
    }

    // Validation des champs artisan si la case est cochée
    if (isArtisan) {
      if (!formData.shopName.trim()) {
        newErrors.shopName = "Le nom de votre boutique est obligatoire."
      }
      if (!formData.identityDocument) {
        newErrors.identityDocument = "La pièce d'identité est obligatoire."
      }
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
      const registerData: RegisterData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        isArtisan,
        shopName: isArtisan ? formData.shopName : undefined,
        description: isArtisan ? formData.description : undefined,
        identityDocument: isArtisan
          ? formData.identityDocument || undefined
          : undefined,
      }

      await register(registerData)

      // Inscription réussie, rediriger
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
          general: errorObj.message || "Erreur lors de l'inscription",
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
        <h1 className="text-2xl font-bold">Bienvenue sur Eklart</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Rejoignez notre communauté d'artisans et d'acheteurs
        </p>
      </div>

      <div className="grid gap-6">
        {/* Erreur générale */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xs p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Prénom et Nom */}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Prénoms *</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleInputChange}
              className={cn(
                "h-10 rounded-xs",
                errors.firstName ? "border-red-500" : ""
              )}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Votre nom"
              value={formData.lastName}
              onChange={handleInputChange}
              className={cn(
                "h-10 rounded-xs",
                errors.lastName ? "border-red-500" : ""
              )}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>
        </div>

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
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleInputChange}
              className={cn(
                "h-10 rounded-xs pr-10",
                errors.password ? "border-red-500" : ""
              )}
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
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={cn(
                "h-10 rounded-xs pr-10",
                errors.confirmPassword ? "border-red-500" : ""
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Checkbox Artisan */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="artisan"
            checked={isArtisan}
            onCheckedChange={(checked) => setIsArtisan(checked as boolean)}
          />
          <Label
            htmlFor="artisan"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Je suis un artisan qui souhaite vendre des articles
          </Label>
        </div>

        {/* Champs artisan conditionnels */}
        {isArtisan && (
          <div className="grid gap-4 p-4 border rounded-xs bg-gray-50">
            <h3 className="font-medium text-sm">Informations artisan</h3>

            {/* Nom de la boutique */}
            <div className="grid gap-2">
              <Label htmlFor="shopName">Nom de votre boutique *</Label>
              <Input
                id="shopName"
                name="shopName"
                type="text"
                placeholder="Le nom de votre boutique"
                value={formData.shopName}
                onChange={handleInputChange}
                className={cn(
                  "h-10 rounded-xs",
                  errors.shopName ? "border-red-500" : ""
                )}
              />
              {errors.shopName && (
                <p className="text-red-500 text-xs">{errors.shopName}</p>
              )}
            </div>

            {/* Pièce d'identité */}
            <div className="grid gap-2">
              <Label htmlFor="identityDocument">Pièce d'identité *</Label>
              <Input
                id="identityDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className={cn(
                  "h-10 rounded-xs",
                  errors.identityDocument ? "border-red-500" : ""
                )}
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés: PDF, JPG, PNG (max 5MB)
              </p>
              {errors.identityDocument && (
                <p className="text-red-500 text-xs">
                  {errors.identityDocument}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Décrivez votre activité artisanale..."
                value={formData.description}
                onChange={handleInputChange}
                className={cn(
                  "rounded-xs",
                  errors.description ? "border-red-500" : ""
                )}
                rows={3}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full rounded-xs h-10"
          disabled={loading}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Vous avez déjà un compte ?{" "}
        <Link to="/login" className="hover:text-primary font-medium">
          Se connecter
        </Link>
      </div>
    </form>
  )
}
