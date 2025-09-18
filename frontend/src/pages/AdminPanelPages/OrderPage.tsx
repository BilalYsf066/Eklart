import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'

export type Order = {
  id: string
  date: string // ISO date string
  orderNumber: string
  customerName: string
  method: string
  amount: number
  status: 'pending' | 'paid' | 'delivered' | 'cancelled'
}

const mockOrders: Order[] = [
  {
    id: 'ord_1',
    date: '2025-09-12T11:20:00Z',
    orderNumber: 'CMD-2025-0001',
    customerName: 'Alice K.',
    method: 'Mobile Money',
    amount: 24500,
    status: 'paid',
  },
  {
    id: 'ord_2',
    date: '2025-09-14T09:05:00Z',
    orderNumber: 'CMD-2025-0002',
    customerName: 'Marc D.',
    method: 'Carte bancaire',
    amount: 120000,
    status: 'pending',
  },
  {
    id: 'ord_3',
    date: '2025-09-17T16:42:00Z',
    orderNumber: 'CMD-2025-0003',
    customerName: 'Zoé P.',
    method: 'PayPal',
    amount: 38000,
    status: 'delivered',
  },
]

export default function OrderPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Order | null>(null)
  const currency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => {
        const v = getValue<string>()
        const d = new Date(v)
        return isNaN(d.getTime()) ? '-' : d.toLocaleString('fr-FR')
      },
    },
    { accessorKey: 'orderNumber', header: 'Commande' },
    { accessorKey: 'customerName', header: 'Client' },
    { accessorKey: 'method', header: 'Méthode' },
    {
      accessorKey: 'amount',
      header: 'Montant',
      cell: ({ getValue }) => currency.format(getValue<number>()),
    },
    { accessorKey: 'status', header: 'Statut' },
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
  ]

  return (
    <div className="flex flex-1 flex-col p-12 gap-4">
      <h1 className="text-3xl font-bold">Commandes</h1>
      <DataTable columns={columns} data={orders} />

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
