"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
//   SidebarItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, BarChart3, Users, PieChart, Settings } from "lucide-react"
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const navigate = useRouter();
  const handleLogout = async() => {
    try {
      const res:any =await api.get('/auth/logout');
      console.log(res);
      if (res.status === 200) {
        // window.location.href = '/login';
        navigate.push('/login');
      }
    } catch (error) {
      console.log(error);

      
    }
  }
  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-sm">
      {/* Header / Brand */}
      <SidebarHeader className="flex items-center justify-center py-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight text-indigo-600">
          DEX<span className="text-gray-700"> IT</span>
        </h1>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col gap-2 mt-2">
        {/* Dashboard Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-gray-400 font-medium tracking-wide px-4">
            Dashboard
          </SidebarGroupLabel>
          {/* <SidebarGroupContent>
            <SidebarMenuItem
            //   icon={BarChart3}
            //   label="Overview"
              className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors rounded-md mx-2"
            >
                Overview
                </SidebarMenuItem>
            <SidebarMenuItem
            //   icon={PieChart}
            //   label="Analytics"
              className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors rounded-md mx-2"
            />
          </SidebarGroupContent> */}
        </SidebarGroup>

        {/* Management Group */}
        {/* <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-gray-400 font-medium tracking-wide px-4">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItem
              icon={Users}
              label="Candidates"
              className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors rounded-md mx-2"
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors rounded-md mx-2"
            />
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      {/* Footer / Logout */}
      <SidebarFooter className="border-t mt-auto p-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
