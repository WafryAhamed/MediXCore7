import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays,
  Pill, FlaskConical, Receipt, UserCog, ScrollText,
  Blocks, Settings, ClipboardList, HeartPulse,
  PackageCheck, FileText, BookOpen, UserCircle,
  ChevronLeft, ChevronRight, LogOut, ChevronDown,
  X,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';
import { NAV_ITEMS, type NavItem } from '../../lib/constants';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import type { Role } from '../../types';

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Stethoscope, CalendarDays,
  Pill, FlaskConical, Receipt, UserCog, ScrollText,
  Blocks, Settings, ClipboardList, HeartPulse,
  PackageCheck, FileText, BookOpen, UserCircle,
};

// ─── Nav Item Component ───────────────────────────────────────────────────────

interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({ item, collapsed }) => {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false);
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.href ||
    (hasChildren && item.children?.some(c => location.pathname === c.href));

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setSubMenuOpen(!subMenuOpen)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  subMenuOpen && 'rotate-180'
                )}
              />
            </>
          )}
        </button>
        <AnimatePresence>
          {subMenuOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-4 mt-1 space-y-1"
            >
              {item.children!.map((child) => (
                <NavItemComponent key={child.href} item={child} collapsed={collapsed} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive: active }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUiStore();
  const role: Role = user?.role || 'PATIENT';
  const navItems = useMemo(() => NAV_ITEMS[role] || [], [role]);
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-700/50 bg-slate-900',
          'lg:relative lg:z-auto',
          !sidebarOpen && 'max-lg:-translate-x-full'
        )}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-4">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white text-sm">
                BC
              </div>
              <span className="text-lg font-bold text-white">Hospital</span>
            </motion.div>
          )}
          {sidebarCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white text-sm mx-auto">
              BC
            </div>
          )}
          {/* Mobile close */}
          <button
            className="rounded-md p-1.5 text-slate-400 hover:text-white lg:hidden"
            onClick={() => toggleSidebar(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavItemComponent key={item.label} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:flex justify-center border-t border-slate-700/50 py-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* User section */}
        <div className="border-t border-slate-700/50 p-3">
          <div className={cn(
            'flex items-center gap-3',
            sidebarCollapsed && 'justify-center'
          )}>
            <Avatar name={fullName} size="sm" status="online" />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{fullName}</p>
                <p className="text-xs text-slate-500 truncate">{role}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={logout}
                className="rounded-md p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
