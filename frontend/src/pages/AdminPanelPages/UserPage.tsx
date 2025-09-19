import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, Check, X } from 'lucide-react'
import { columns as baseUserColumns } from '@/app/users/columns'
import type { User, ArtisanApplication } from '@/app/users/columns'
import type { ColumnDef } from '@tanstack/react-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function UserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [applications, setApplications] = useState<ArtisanApplication[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [usersRes, appsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/artisan-applications'),
      ])
      const approvedArtisans = usersRes.data.filter((u: User) => u.role === 'artisan' && u.status === 'approved')
      const otherUsers = usersRes.data.filter((u: User) => u.role !== 'artisan' || u.status !== 'approved')
      
      setUsers([...approvedArtisans, ...otherUsers])
      setApplications(appsRes.data)
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (applicationId: string) => {
    try {
      await api.post(`/admin/artisan-applications/${applicationId}/approve`)
      toast.success("Demande d'artisan approuvée.")
      fetchData() // Refresh data
    } catch (error) {
      toast.error("Erreur lors de l'approbation.")
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      await api.post(`/admin/artisan-applications/${applicationId}/reject`)
      toast.success("Demande d'artisan rejetée.")
      fetchData() // Refresh data
    } catch (error) {
      toast.error("Erreur lors du rejet.")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success("Utilisateur supprimé avec succès.")
      fetchData() // Refresh data
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur.")
    }
  }

  const userActionColumn: ColumnDef<User> = {
    id: 'actions',
    cell: ({ row: { original: user } }) => (
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" size="icon" title="Voir les détails">
          <Eye className="h-4 w-4" />
        </Button>
        {user.role !== 'admin' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Supprimer">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible et supprimera définitivement l'utilisateur.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    ),
    header: "",
    meta: { className: "text-right" }
  }

  const applicationActionColumn: ColumnDef<ArtisanApplication> = {
    id: 'actions',
    cell: ({ row: { original: app } }) => (
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={() => handleApprove(app.id)} title="Approuver">
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" title="Rejeter">
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rejeter la demande ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action marquera la demande comme rejetée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleReject(app.id)}>
                Rejeter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
    header: "",
    meta: { className: "text-right" }
  }

  const userColumns = useMemo(() => [...baseUserColumns, userActionColumn], [])
  const applicationColumns: ColumnDef<ArtisanApplication>[] = useMemo(() => [
    { accessorKey: "name", header: "Nom" },
    { accessorKey: "identifier", header: "Identifiant" },
    { accessorKey: "shopName", header: "Boutique" },
    { 
      accessorKey: "identityDocument", 
      header: "Pièce d'identité",
      cell: ({ getValue }) => (
        <a href={`/storage/${getValue<string>()}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Voir le document
        </a>
      )
    },
    applicationActionColumn
  ], [])

  return (
    <div className="flex flex-1 flex-col p-12">
      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xs">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="applications">Demandes {applications.length > 0 && `(${applications.length})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <DataTable
              columns={userColumns}
              data={users}
            />
          </TabsContent>
          <TabsContent value="applications" className="mt-6">
            <DataTable
              columns={applicationColumns}
              data={applications}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}