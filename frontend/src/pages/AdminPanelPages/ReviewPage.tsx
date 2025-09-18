import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'

// Types
export type Review = {
  id: string
  clientName: string
  comment: string
  date: string // ISO date string
  visible: boolean
}

// Mock data
const mockReviews: Review[] = [
  {
    id: 'rev_1',
    clientName: 'Alice K.',
    comment: 'Produit de très bonne qualité, livraison rapide !',
    date: '2025-09-03T12:30:00Z',
    visible: true,
  },
  {
    id: 'rev_2',
    clientName: 'Marc D.',
    comment: "Le service client a été très réactif. Je recommande.",
    date: '2025-09-12T09:15:00Z',
    visible: true,
  },
  {
    id: 'rev_3',
    clientName: 'Zoé P.',
    comment: 'Couleurs légèrement différentes que sur les photos, mais satisfait.',
    date: '2025-09-15T17:45:00Z',
    visible: false,
  },
]

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)

  const toggleVisibility = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, visible: !r.visible } : r))
  }

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const columns: ColumnDef<Review>[] = [
    { accessorKey: 'clientName', header: 'Client' },
    {
      accessorKey: 'comment',
      header: 'Commentaire',
      cell: ({ getValue }) => (
        <span className="line-clamp-2 max-w-[520px] text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => {
        const v = getValue<string>()
        const d = new Date(v)
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR')
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleVisibility(original.id)}
            title={original.visible ? 'Masquer' : 'Afficher'}
          >
            {original.visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
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
  ]

  return (
    <div className="flex flex-1 flex-col p-12 gap-4">
      <h1 className="text-3xl font-bold">Avis</h1>
      <DataTable columns={columns} data={reviews} />
    </div>
  )
}