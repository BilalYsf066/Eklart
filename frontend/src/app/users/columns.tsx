"use client"

import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
export type User = {
  id: string
  name: string
  identifier: string
  status: 'active' | 'inactive' | 'pending'
  role: string
}

// src/app/users/columns.tsx
export type ArtisanApplication = {
  id: string
  name: string
  identifier: string
  shopName: string
  identityDocument: string
  status: 'pending' | 'approved' | 'rejected'
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
    accessorKey: "identifier",
    header: "Identifiant",
  },
  {
    accessorKey: "role",
    header: "Rôle",
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  // This column will be used for actions and will be positioned on the right
  {
    id: "actions",
    cell: () => null, // This will be overridden in UserPage
    header: "",
    meta: {
      className: "w-32 text-right" // Add right alignment
    }
  }
]