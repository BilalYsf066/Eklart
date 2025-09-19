"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
export type User = {
  id: string
  name: string
  email?: string
  phone: string
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected'
  role: string
}

export type ArtisanApplication = {
  id: string
  name: string
  identifier: string // email or phone
  shopName: string
  identityDocument: string
  status: 'pending'
}

const statusVariantMap: { [key in User['status']]: 'default' | 'secondary' | 'destructive' } = {
  active: 'default',
  approved: 'default',
  pending: 'secondary',
  inactive: 'secondary',
  rejected: 'destructive',
}

const statusClasses: { [key in User['status']]: string } = {
  active: 'bg-green-600 text-white',
  approved: 'bg-green-600 text-white',
  pending: 'bg-yellow-500 text-white',
  inactive: 'bg-gray-500 text-white',
  rejected: 'bg-red-600 text-white',
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => getValue<string>() || 'N/A',
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ getValue }) => getValue<string>() || 'N/A',
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ getValue }) => <span className="capitalize">{getValue<string>()}</span>,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ getValue }) => {
      const status = getValue<User['status']>()
      return (
        <Badge
          variant={statusVariantMap[status] || 'secondary'}
          className={statusClasses[status] || ''}
        >
          {status}
        </Badge>
      )
    },
  },
]