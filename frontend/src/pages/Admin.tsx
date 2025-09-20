import { Outlet, useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'

export default function Admin() {
  const { pathname } = useLocation()
  const labelMap: Record<string, string> = {
    '/admin': 'Utilisateurs',
    '/admin/users': 'Utilisateurs',
    '/admin/categories': 'Catégories',
    '/admin/orders': 'Commandes',
    '/admin/articles': 'Articles',
    '/admin/reviews': 'Avis',
  }
  const currentLabel = labelMap[pathname] ?? 'Utilisateurs'
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Panneau d'administration
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto relative mr-2" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative rounded-full hover:bg-gray-100 p-1"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-foreground hover:text-primary active:text-primary" />
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xs shadow-lg ring-none z-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <button 
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label="Close notifications"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    Les notifications arrivent bientôt.
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>  
  )
}