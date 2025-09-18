import { useMemo, useState } from 'react'
import { DataTable } from '@/components/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Plus } from 'lucide-react'

// Types
export type Category = {
  id: string
  name: string
  articlesCount: number
  status: 'active' | 'inactive'
}

// Mock data
const mockCategories: Category[] = [
  { id: 'cat_1', name: 'Mobilier', articlesCount: 24, status: 'active' },
  { id: 'cat_2', name: 'Décoration', articlesCount: 18, status: 'active' },
  { id: 'cat_3', name: 'Textiles', articlesCount: 9, status: 'inactive' },
]

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)

  // Dialog state
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setMode('add')
  }

  const openAdd = () => {
    resetForm()
    setMode('add')
    setOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingId(cat.id)
    setName(cat.name)
    setMode('edit')
    setOpen(true)
  }

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) return

    if (mode === 'add') {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: name.trim(),
        articlesCount: 0,
        status: 'active',
      }
      setCategories(prev => [newCategory, ...prev])
    } else if (mode === 'edit' && editingId) {
      setCategories(prev => prev.map(c => c.id === editingId ? { ...c, name: name.trim() } : c))
    }

    setOpen(false)
    resetForm()
  }

  const onDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const columns: ColumnDef<Category>[] = useMemo(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'articlesCount', header: "Nombre d'articles" },
    { accessorKey: 'status', header: 'Statut' },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEdit(original)}
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(original.id)}
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

      <DataTable columns={columns} data={categories} />
    </div>
  )
}