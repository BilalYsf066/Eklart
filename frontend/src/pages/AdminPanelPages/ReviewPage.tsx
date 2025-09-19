import { useEffect, useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export type Review = {
  id: string
  clientName: string
  comment: string
  date: string
  visible: boolean
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/reviews')
      setReviews(response.data)
    } catch (error) {
      toast.error("Erreur lors de la récupération des avis.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, visible: !currentVisibility } : r))
    try {
      await api.post(`/admin/reviews/${id}/toggle-visibility`)
      toast.success("Visibilité de l'avis mise à jour.")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.")
      setReviews(prev => prev.map(r => r.id === id ? { ...r, visible: currentVisibility } : r))
    }
  }

  const deleteReview = async (id: string) => {
    try {
      await api.delete(`/admin/reviews/${id}`)
      toast.success("Avis supprimé avec succès.")
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'avis.")
    }
  }

  const columns: ColumnDef<Review>[] = useMemo(() => [
    { accessorKey: 'clientName', header: 'Client' },
    {
      accessorKey: 'comment',
      header: 'Commentaire',
      cell: ({ getValue }) => (
        <p className="line-clamp-2 max-w-md text-muted-foreground">{getValue<string>()}</p>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('fr-FR'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleVisibility(original.id, original.visible)}
            title={original.visible ? 'Masquer' : 'Afficher'}
          >
            {original.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteReview(original.id)}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
      meta: { className: 'text-right' },
    },
  ], [])

  return (
    <div className="flex flex-1 flex-col p-12 gap-4">
      <h1 className="text-3xl font-bold">Avis</h1>
      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <DataTable columns={columns} data={reviews} />
      )}
    </div>
  )
}