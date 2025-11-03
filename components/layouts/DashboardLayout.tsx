import React from 'react'
import { AppSidebar } from '../AppSidebar';
import { SidebarProvider } from '../ui/sidebar';

interface Props {
    children: React.ReactNode;
}
const DashboardLayout:React.FC<Props> = ({children}) => {
  return (
    <SidebarProvider>
          <AppSidebar/>
          <div className='w-full'>

        {children}
          </div>
        </SidebarProvider>
  )
}

export default DashboardLayout