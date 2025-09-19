import { useEffect, useState, useMemo } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type Article = {
  id: string
  name: string
  price: number
  quantity: number
  artisan: string
  addedAt: string
  imageUrl: string
  visible: boolean
  category: string
}

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  
  const fetchArticles = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/articles')
      setArticles(response.data)
    } catch (error) {
      toast.error("Erreur lors de la récupération des articles.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    // Optimistic update
    setArticles(prev => prev.map(a => a.id === id ? { ...a, visible: !currentVisibility } : a))
    try {
      await api.post(`/admin/articles/${id}/toggle-visibility`)
      toast.success(`Visibilité de l'article mise à jour.`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.")
      // Revert on error
      setArticles(prev => prev.map(a => a.id === id ? { ...a, visible: currentVisibility } : a))
    }
  }

  const deleteArticle = async (id: string) => {
    try {
      await api.delete(`/admin/articles/${id}`)
      toast.success("Article supprimé avec succès.")
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'article.")
    }
  }

  const currency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })

  const columns: ColumnDef<Article>[] = useMemo(() => [
    {
      accessorKey: 'imageUrl',
      header: 'Photo',
      cell: ({ row: { original } }) => (
        <img
          src={original.imageUrl || 'https://via.placeholder.com/50'}
          alt={original.name}
          className="h-12 w-12 rounded object-cover border"
        />
      ),
    },
    { accessorKey: 'name', header: 'Nom' },
    {
      accessorKey: 'price',
      header: 'Prix',
      cell: ({ getValue }) => currency.format(getValue<number>()),
    },
    { accessorKey: 'quantity', header: 'Stock' },
    { accessorKey: 'artisan', header: 'Artisan' },
    { accessorKey: 'category', header: 'Catégorie' },
    {
      accessorKey: 'visible',
      header: 'Statut',
      cell: ({ getValue }) => (
        <Badge variant={getValue<boolean>() ? 'default' : 'secondary'} className={getValue<boolean>() ? 'bg-green-600' : ''}>
          {getValue<boolean>() ? 'Publié' : 'Brouillon'}
        </Badge>
      )
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
            onClick={() => deleteArticle(original.id)}
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
      <h1 className="text-3xl font-bold">Articles</h1>
      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <DataTable columns={columns} data={articles} />
      )}
    </div>
  )
}