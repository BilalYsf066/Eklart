import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

// Type definition for an article
type Article = {
  id: string
  name: string
  price: number
  quantity: number
  artisan: string
  addedAt: string // ISO date string
  imageUrl: string
  visible: boolean
  category: string
}

// Mock data - replace with real API call
const mockArticles: Article[] = [
  {
    id: 'art_1',
    name: 'Tabouret en bois',
    price: 15000,
    quantity: 12,
    artisan: 'Atelier Bois & Fer',
    addedAt: '2025-08-21T10:24:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1598300053650-5b89351aff97?q=80&w=600&auto=format&fit=crop',
    visible: true,
    category: 'Mobilier',
  },
  {
    id: 'art_2',
    name: 'Poterie décorative',
    price: 9500,
    quantity: 7,
    artisan: 'Artisanat Créatif',
    addedAt: '2025-09-01T08:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31b2?q=80&w=600&auto=format&fit=crop',
    visible: false,
    category: 'Décoration',
  },
  {
    id: 'art_3',
    name: 'Tapis tissé à la main',
    price: 42000,
    quantity: 3,
    artisan: 'Maison du Tissage',
    addedAt: '2025-09-10T15:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=600&auto=format&fit=crop',
    visible: true,
    category: 'Textiles',
  },
]

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)

  const toggleVisibility = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, visible: !a.visible } : a))
  }

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  // Currency formatter (XOF for West Africa). Adjust as needed.
  const currency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })

  const columns: ColumnDef<Article>[] = [
    {
      accessorKey: 'imageUrl',
      header: 'Photo',
      cell: ({ row: { original } }) => (
        <div className="flex items-center">
          <img
            src={original.imageUrl}
            alt={original.name}
            className="h-12 w-12 rounded object-cover border"
          />
        </div>
      ),
    },
    { accessorKey: 'name', header: 'Nom' },
    {
      accessorKey: 'price',
      header: 'Prix',
      cell: ({ getValue }) => currency.format(getValue<number>()),
    },
    { accessorKey: 'quantity', header: 'Quantité' },
    { accessorKey: 'artisan', header: 'Artisan' },
    { accessorKey: 'category', header: 'Catégorie' },
    {
      accessorKey: 'addedAt',
      header: "Date d'ajout",
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
            onClick={() => deleteArticle(original.id)}
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
      <h1 className="text-3xl font-bold">Articles</h1>
      <DataTable columns={columns} data={articles} />
    </div>
  )
}