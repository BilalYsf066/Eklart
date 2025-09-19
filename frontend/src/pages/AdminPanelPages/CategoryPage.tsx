import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export type Category = {
  id: string
  name: string
  articles_count: number
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [name, setName] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data)
    } catch (error) {
      toast.error("Erreur lors de la récupération des catégories.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setCurrentCategory(null)
    setName('')
    setMode('add')
  }

  const openAdd = () => {
    resetForm()
    setMode('add')
    setOpen(true)
  }

  const openEdit = (cat: Category) => {
    setCurrentCategory(cat)
    setName(cat.name)
    setMode('edit')
    setOpen(true)
  }

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) {
      toast.error("Le nom de la catégorie ne peut pas être vide.")
      return
    }

    try {
      if (mode === 'add') {
        await api.post('/admin/categories', { name: name.trim() })
        toast.success("Catégorie ajoutée avec succès.")
      } else if (mode === 'edit' && currentCategory) {
        await api.put(`/admin/categories/${currentCategory.id}`, { name: name.trim() })
        toast.success("Catégorie mise à jour avec succès.")
      }
      fetchCategories()
      setOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Une erreur est survenue.")
    }
  }

  const onDelete = async (id: string) => {
    try {
      await api.delete(`/admin/categories/${id}`)
      toast.success("Catégorie supprimée avec succès.")
      fetchCategories()
    } catch (error) {
      toast.error("Erreur lors de la suppression.")
    }
  }

  const columns: ColumnDef<Category>[] = useMemo(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Nom' },
    { 
      accessorKey: 'articles_count', 
      header: "Nombre d'articles",
      cell: ({ getValue }) => <Badge variant="secondary">{getValue<number>()}</Badge>
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(original)} title="Modifier">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(original.id)} title="Supprimer">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
      meta: { className: 'text-right' },
    },
  ], [])

  return (
    <div className="flex flex-1 flex-col p-12 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Catégories</h1>
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o) }}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{mode === 'add' ? 'Ajouter une catégorie' : 'Modifier la catégorie'}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="category-name">Nom</Label>
                <Input
                  id="category-name"
                  placeholder="Ex: Mobilier"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => { setOpen(false); resetForm() }}>Annuler</Button>
                <Button type="submit">{mode === 'add' ? 'Ajouter' : 'Enregistrer'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <DataTable columns={columns} data={categories} />
      )}
    </div>
  )
}