import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, Check } from 'lucide-react'
import { columns } from '@/app/users/columns'
import type { User } from '@/app/users/columns'
import type { ArtisanApplication } from '@/app/users/columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data - replace with real API call
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Eklart',
    email: 'admin@eklart.com',
    phone: '',
    status: 'active',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jean Soko',
    email: 'jeansoko@gmail.com',
    phone: '+229 01 5566 7788',
    status: 'inactive',
    role: 'artisan',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    phone: '+229 01 9900 1122',
    status: 'pending',
    role: 'client',
  },
]

const mockApplications: ArtisanApplication[] = [
  {
    id: 'a1',
    name: 'Marie Dupont',
    identifier: 'marie.d@example.com',
    shopName: 'Artisanat Créatif',
    identityDocument: 'ID-123456',
    status: 'pending'
  },
  {
    id: 'a2',
    name: 'Pierre Martin',
    identifier: '+229 01 95 21 32 74',
    shopName: 'Bois & Fer',
    identityDocument: 'ID-789012',
    status: 'pending'
  }
]

export default function UserPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [applications, setApplications] = useState<ArtisanApplication[]>(mockApplications)

  // Handle approving an application
  const handleApprove = (application: ArtisanApplication) => {
    // Create new user from application
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: application.name,
      email: application.identifier,
      phone: '',
      status: 'active',
      role: 'artisan'
    }
    // Add new user to users array
    setUsers([...users, newUser])
    // Remove application from applications array
    setApplications(applications.filter(app => app.id !== application.id))
  }

  // Handle rejecting an application
  const handleReject = (applicationId: string) => {
    // Remove application from applications array
    setApplications(applications.filter(app => app.id !== applicationId));
  }

  const actionColumn = {
    id: 'actions',
    cell: ({ row: { original: user } }: { row: { original: User } }) => {
      return (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => console.log('View user:', user.id)}
            title="Voir les détails"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {user.role !== 'admin' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => console.log('Delete user:', user.id)}
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      )
    },
    header: "",
    meta: {
      className: "text-right"
    }
  }

  const applicationActions = {
    id: 'actions',
    cell: ({ row: { original: app } }: { row: { original: ArtisanApplication } }) => (
      <div className="flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleApprove(app)}
          title="Approuver"
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleReject(app.id)}
          title="Rejeter"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
    header: "",
    meta: { className: "text-right" }
  }

  const applicationColumns = [
    { accessorKey: "name", header: "Nom" },
    { accessorKey: "identifier", header: "Identifiant" },
    { accessorKey: "shopName", header: "Boutique" },
    { accessorKey: "identityDocument", header: "Pièce d'identité" },
    applicationActions
  ]

  const tableColumns = [...columns, actionColumn]

  return (
    <div className="flex flex-1 flex-col p-12">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 rounded-xs">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="applications">Demandes</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <DataTable
            columns={tableColumns}
            data={users}
          />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <DataTable
            columns={applicationColumns}
            data={applications}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
