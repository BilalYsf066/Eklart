import * as React from "react"
import { Container, MessagesSquare, Package, Settings, Users, Wallet } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
//import { Link } from "react-router-dom"

// This is sample data.
const data = {
  navMain: [
    {
      icon: Users,
      title: "Utilisateurs",
      path: "/admin/users",
    },
    {
      icon: Package,
      title: "Catégories",
      path: "/admin/categories",
    },
    {
      icon: Container,
      title: "Articles",
      path: "/admin/articles",
    },
    {
      icon: Wallet,
      title: "Commandes",
      path: "/admin/orders",
    },
    {
      icon: MessagesSquare,
      title: "Avis",
      path: "/admin/reviews",
    },
    {
      icon: Settings,
      title: "Paramètres",
      path: "/admin/settings",
    },
  ],
}

const navData = {
  user: {
    name: "Admin Eklart",
    email: "admin@eklart.com",
    avatar: "https://via.placeholder.com/150",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex flex-col gap-0.5 leading-none mt-2 ml-2">
                  <span className="font-bold text-xl">Eklart</span>
                  <span className="text-sm">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
