import { useEffect, useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export type Order = {
  id: string
  date: string
  orderNumber: string
  customerName: string
  method: string
  amount: number
  status: 'en attente' | 'payée' | 'livré' | 'annulé'
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Order | null>(null)
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await api.get('/admin/orders')
        setOrders(response.data)
      } catch (error) {
        toast.error("Erreur lors de la récupération des commandes.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const currency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })

  const columns: ColumnDef<Order>[] = useMemo(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString('fr-FR'),
    },
    { accessorKey: 'orderNumber', header: 'Commande' },
    { accessorKey: 'customerName', header: 'Client' },
    { accessorKey: 'method', header: 'Méthode' },
    {
      accessorKey: 'amount',
      header: 'Montant',
      cell: ({ getValue }) => currency.format(getValue<number>()),
    },
    { 
      accessorKey: 'status', 
      header: 'Statut',
      cell: ({ getValue }) => {
        const status = getValue<Order['status']>()
        const statusClasses = {
          'livré': 'bg-green-600',
          'payée': 'bg-blue-600',
          'en attente': 'bg-yellow-500',
          'annulé': 'bg-red-600',
        }[status]
        return <Badge className={statusClasses}>{status}</Badge>
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            title="Voir les détails"
            onClick={() => { setCurrent(original); setOpen(true) }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
      meta: { className: 'text-right' },
    },
  ], [])

  return (
    <div className="flex flex-1 flex-col p-12 gap-4">
      <h1 className="text-3xl font-bold">Commandes</h1>
      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
      <Dialog open={open} onOpenChange={(o) => { if (!o) setCurrent(null); setOpen(o) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
          </DialogHeader>
          {current && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground text-xs">Commande</p>
                <p className="font-medium">{current.orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Date</p>
                <p className="font-medium">{new Date(current.date).toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Client</p>
                <p className="font-medium">{current.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Méthode</p>
                <p className="font-medium">{current.method}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Montant</p>
                <p className="font-medium">{currency.format(current.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Statut</p>
                <p className="font-medium capitalize">{current.status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}