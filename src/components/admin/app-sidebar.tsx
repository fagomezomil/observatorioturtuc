"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Hotel,
  Users,
  BarChart3,
  Compass,
  Heart,
  UsersRound,
  Info,
  Globe,
  UserPlus,
  Clock,
  Moon,
  DollarSign,
  TreePine,
  TrendingUp,
  FileText,
  UserCog,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Periodos", href: "/admin/periodos", icon: Calendar },
  { title: "Destinos", href: "/admin/destinos", icon: MapPin },
  { title: "Ocupación Hotelera", href: "/admin/ocupacion", icon: Hotel },
  { title: "Perfil Turista", href: "/admin/perfil", icon: Users },
  { title: "Procedencia", href: "/admin/procedencia", icon: Compass },
  { title: "Motivos de Viaje", href: "/admin/motivos", icon: Heart },
  { title: "Rangos de Edad", href: "/admin/rangos-edad", icon: BarChart3 },
  { title: "Info Previa", href: "/admin/info-previa", icon: Info },
  { title: "Sitios Consultados", href: "/admin/sitios", icon: Globe },
  { title: "Compañía de Viaje", href: "/admin/compania", icon: UserPlus },
  { title: "Anticipación", href: "/admin/anticipacion", icon: Clock },
  { title: "Estadía Promedio", href: "/admin/estadia", icon: Moon },
  { title: "Gasto Promedio", href: "/admin/gasto", icon: DollarSign },
  { title: "Actividades", href: "/admin/actividades", icon: TreePine },
  { title: "Movimiento Turistas", href: "/admin/movimiento", icon: TrendingUp },
  { title: "Pernoctes Extra", href: "/admin/pernoctes", icon: Hotel },
  { title: "Impacto Económico", href: "/admin/impacto", icon: DollarSign },
  { title: "Notas Metodológicas", href: "/admin/notas", icon: FileText },
];

const adminOnlyItems = [
  { title: "Usuarios", href: "/admin/usuarios", icon: UserCog },
];

export function AppSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logos/Logo Observatorio Turístico ETT 2025.png"
            alt="Observatorio Turístico"
            width={40}
            height={40}
            className="rounded"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Observatorio
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              Turístico Tucumán
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {role === "ADMIN" &&
                adminOnlyItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={pathname === item.href}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground w-full"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}