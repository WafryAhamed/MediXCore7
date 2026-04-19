import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  FileTextIcon,
  PlusCircleIcon,
  KeyIcon,
  UsersIcon,
  StethoscopeIcon,
  ShieldIcon,
  ActivityIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';
interface SidebarProps {
  role?: 'patient' | 'doctor' | 'admin';
}
const patientLinks = [
{
  label: 'Dashboard',
  href: '/patient/dashboard',
  icon: LayoutDashboardIcon
},
{
  label: 'Medical Records',
  href: '/patient/records',
  icon: FileTextIcon
},
{
  label: 'Add Record',
  href: '/patient/records/new',
  icon: PlusCircleIcon
},
{
  label: 'Access Control',
  href: '/patient/access',
  icon: KeyIcon
}];

const doctorLinks = [
{
  label: 'Dashboard',
  href: '/doctor/dashboard',
  icon: LayoutDashboardIcon
},
{
  label: 'Patients',
  href: '/doctor/patients',
  icon: UsersIcon
},
{
  label: 'Shared Records',
  href: '/doctor/records',
  icon: FileTextIcon
}];

const adminLinks = [
{
  label: 'Dashboard',
  href: '/admin',
  icon: LayoutDashboardIcon
},
{
  label: 'Users',
  href: '/admin/users',
  icon: UsersIcon
},
{
  label: 'System Logs',
  href: '/admin/logs',
  icon: ActivityIcon
},
{
  label: 'Transactions',
  href: '/admin/transactions',
  icon: ShieldIcon
}];

export function Sidebar({ role = 'patient' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const links =
  role === 'doctor' ?
  doctorLinks :
  role === 'admin' ?
  adminLinks :
  patientLinks;
  const roleIcon =
  role === 'doctor' ?
  StethoscopeIcon :
  role === 'admin' ?
  ShieldIcon :
  LayoutDashboardIcon;
  const roleLabel =
  role === 'doctor' ? 'Doctor' : role === 'admin' ? 'Admin' : 'Patient';
  const RoleIconComponent = roleIcon;
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{
          width: collapsed ? 72 : 256
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut'
        }}
        className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-primary border-r border-border z-40">
        
        {/* Role Badge */}
        <div className="p-4 border-b border-border">
          <div
            className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <RoleIconComponent className="w-5 h-5 text-accent" />
            </div>
            {!collapsed &&
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}>
              
                <p className="text-xs text-textMuted uppercase tracking-wider">
                  Role
                </p>
                <p className="text-sm font-semibold text-textLight">
                  {roleLabel}
                </p>
              </motion.div>
            }
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-accent/10 text-accent' : 'text-textMuted hover:text-textLight hover:bg-white/5'}`}
                title={collapsed ? link.label : undefined}>
                
                <IconComponent
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent' : ''}`} />
                
                {!collapsed && <span>{link.label}</span>}
                {isActive && !collapsed &&
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />

                }
              </Link>);

          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-textMuted hover:text-textLight rounded-lg hover:bg-white/5 transition-colors text-sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            
            {collapsed ?
            <ChevronRightIcon className="w-4 h-4" /> :

            <>
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Collapse</span>
              </>
            }
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-xl border-t border-border z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {links.slice(0, 4).map((link) => {
            const isActive = location.pathname === link.href;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'text-accent' : 'text-textMuted'}`}>
                
                <IconComponent className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>);

          })}
        </div>
      </nav>
    </>);

}
