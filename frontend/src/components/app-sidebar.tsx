import * as React from "react"
import { Container, GalleryVerticalEnd, MessagesSquare, Package, Settings, Users, Wallet } from "lucide-react"
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
      title: "Transactions",
      path: "/admin/transactions",
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
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold">Eklart</span>
                  <span className="">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
