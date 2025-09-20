import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Save, 
  X, 
  LogOut, 
  Trash2, 
  Building, 
  Home, 
  Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

// Component for Input with Icon
const InputWithIcon = ({ icon: Icon, ...props }: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Icon className="h-4 w-4" /></span>
    <Input {...props} className={props.className ? `${props.className} pl-9` : 'pl-9'} />
  </div>
)

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function Profile() {
  const { user, logout, checkAuth } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [activeTab, setActiveTab] = useState<'profil' | 'historique'>('profil')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile')
        setProfileData(response.data)
      } catch (error) {
        toast.error("Impossible de charger le profil.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])
  
  useEffect(() => {
    if (activeTab === 'historique') {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const response = await api.get('/orders');
          setOrders(response.data);
        } catch (error) {
          toast.error("Impossible de charger l'historique des commandes.");
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev: any) => ({ ...prev, [name]: value }))
  }
  
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev: any) => ({
      ...prev,
      client: { ...prev.client, [name]: value },
    }))
  }

  const handleArtisanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev: any) => ({
      ...prev,
      artisan: { ...prev.artisan, [name]: value },
    }))
  }

  const handleSave = async () => {
    const payload = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email,
      phone: profileData.phone,
      ...(user?.role === 'CLIENT' && profileData.client && {
        address: profileData.client.address,
        city: profileData.client.city
      }),
      ...(user?.role === 'ARTISAN' && profileData.artisan && {
        shop_name: profileData.artisan.shop_name,
        description: profileData.artisan.description
      })
    }

    try {
      const response = await api.put('/profile', payload)
      setProfileData(response.data)
      setIsEditing(false)
      await checkAuth()
      toast.success("Profil mis à jour avec succès !")
    } catch (error: any) {
      const errors = error.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach((err: any) => toast.error(err))
      } else {
        toast.error("Erreur lors de la mise à jour.")
      }
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.")
      return
    }
    try {
      await api.put('/profile/password', passwordData)
      toast.success("Mot de passe mis à jour avec succès !")
      setIsPasswordModalOpen(false)
      setPasswordData({ current_password: '', password: '', password_confirmation: '' })
    } catch (error: any) {
      const message = error.response?.data?.errors?.current_password?.[0] || "Erreur lors du changement de mot de passe."
      toast.error(message)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api.post('/profile/delete', { password: deletePassword })
      toast.success("Compte supprimé avec succès.")
      logout()
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du compte.")
    }
  }

  if (loading) return <div>Chargement...</div>
  if (!profileData) return <div>Impossible de charger le profil.</div>
  
  const initials = `${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase()

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
            {/* Sidebar */}
            <aside>
              <nav className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-primary/30 rounded-xs ${activeTab === 'profil' ? 'bg-primary/30 text-primary' : ''}`}
                  onClick={() => setActiveTab('profil')}
                >
                  Profil
                </button>
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-primary/30 rounded-xs ${activeTab === 'historique' ? 'bg-primary/30 text-primary' : ''}`}
                  onClick={() => setActiveTab('historique')}
                >
                  Historique
                </button>
              </nav>
            </aside>

            {/* Content */}
            <section className="space-y-8">
              {activeTab === 'profil' ? (
                <>
                  <Card className="rounded-xs bg-white">
                    <CardHeader>
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-semibold">{profileData.full_name}</h2>
                        <div className="bg-primary text-sm text-white px-2 py-1 rounded-full">
                          {profileData.role === 'ARTISAN' 
                            ? 'Compte Professionnel' 
                            : 'Compte Particulier'}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="rounded-xs bg-white">
                    <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">Prénom</Label>
                          <InputWithIcon
                            id="first_name"
                            name="first_name"
                            value={profileData.first_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            icon={User}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Nom</Label>
                          <InputWithIcon
                            id="last_name"
                            name="last_name"
                            value={profileData.last_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            icon={User}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <InputWithIcon
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            icon={Mail}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <InputWithIcon
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            icon={Phone}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {user?.role === 'CLIENT' && (
                    <Card className="rounded-xs bg-white">
                      <CardHeader>
                        <CardTitle>Adresse de livraison</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <InputWithIcon
                            id="address"
                            name="address"
                            value={profileData.client?.address || ''}
                            onChange={handleClientChange}
                            disabled={!isEditing}
                            icon={Home}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <InputWithIcon
                            id="city"
                            name="city"
                            value={profileData.client?.city || ''}
                            onChange={handleClientChange}
                            disabled={!isEditing}
                            icon={Building}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {user?.role === 'ARTISAN' && (
                    <Card className="rounded-xs bg-white">
                      <CardHeader>
                        <CardTitle>Informations de la boutique</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="shop_name">Nom de la boutique</Label>
                          <InputWithIcon
                            id="shop_name"
                            name="shop_name"
                            value={profileData.artisan?.shop_name || ''}
                            onChange={handleArtisanChange}
                            disabled={!isEditing}
                            icon={Briefcase}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={profileData.artisan?.description || ''}
                            onChange={handleArtisanChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Nombre d'articles : {profileData.artisan?.articles_count || 0}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="rounded-xs bg-white">
                    <CardHeader>
                      <CardTitle>Sécurité</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div>
                        <Label>Mot de passe</Label>
                        <p className="text-sm text-muted-foreground">••••••••</p>
                      </div>
                      <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>Modifier</Button>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      {isEditing ? (
                        <div className="space-x-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="mr-2 h-4 w-4" />Annuler
                          </Button>
                          <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />Enregistrer
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="mr-2 h-4 w-4" />Modifier le profil
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => { logout(); navigate('/'); }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />Déconnexion
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer le compte
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
                            <AlertDialogDescription>Cette action est irréversible. Pour confirmer, veuillez saisir votre mot de passe.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="delete-password">Mot de passe</Label>
                            <Input
                              id="delete-password"
                              type="password"
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteAccount} 
                              disabled={!deletePassword}
                            >
                              Confirmer la suppression
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Card className="rounded-xs bg-white">
                    <CardHeader>
                      <CardTitle>Historique des commandes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : orders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-muted-foreground">
                                <th className="p-5 font-medium">Commande</th>
                                <th className="p-5 font-medium">Date</th>
                                <th className="p-5 font-medium">Articles</th>
                                <th className="p-5 font-medium">Total</th>
                                <th className="p-5 font-medium">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {orders.map((order) => (
                                <tr key={order.id}>
                                  <td className="p-5 font-medium">{order.order_number}</td>
                                  <td className="p-5">{order.date}</td>
                                  <td className="p-5">
                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                  </td>
                                  <td className="p-5">{order.total.toLocaleString()} FCFA</td>
                                  <td className="p-5">
                                    <Badge variant={
                                      order.status === 'livré' ? 'default' :
                                      order.status === 'annulé' ? 'destructive' :
                                      'secondary'
                                    } className={
                                      order.status === 'livré' ? 'bg-green-600' : ''
                                    }>
                                      {order.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </section>
          </div>
        </div>
      </main>    
      <Footer />

      <AlertDialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changer le mot de passe</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Mot de passe actuel</Label>
              <Input
                id="current_password"
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData(p => ({ ...p, current_password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password" 
                type="password" 
                value={passwordData.password} 
                onChange={(e) => setPasswordData(p => ({ ...p, password: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData(p => ({ ...p, password_confirmation: e.target.value }))}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePasswordChange}>
                Enregistrer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}