import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, Search, Bell, Sun, Moon, ChevronRight,
  LogOut, User, Settings,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Avatar } from '../ui/Avatar';

import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { useNotificationStore } from '../../store/notificationStore';
import { ROUTES } from '../../lib/constants';

// ─── Breadcrumb Generator ─────────────────────────────────────────────────────

function generateBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; href: string }> = [];
  let path = '';
  for (const part of parts) {
    path += `/${part}`;
    crumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      href: path,
    });
  }
  return crumbs;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export const Navbar: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { toggleSidebar, toggleTheme, theme, toggleCommandPalette } = useUiStore();
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          onClick={() => toggleSidebar()}
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 min-w-0">
          <Link to="/" className="hover:text-slate-200 shrink-0">
            Home
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              {i === breadcrumbs.length - 1 ? (
                <span className="text-slate-200 font-medium truncate">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.href} className="hover:text-slate-200 truncate">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => toggleCommandPalette()}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline rounded border border-slate-600 bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 w-80 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
              sideOffset={5}
              align="end"
            >
              <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-200">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <DropdownMenu.Item
                      key={n.id}
                      className={cn(
                        'flex gap-3 px-4 py-3 outline-none cursor-pointer hover:bg-slate-700/50',
                        !n.read && 'bg-primary/5'
                      )}
                      onSelect={() => markRead(n.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{n.title}</p>
                        <p className="text-xs text-slate-400 truncate">{n.message}</p>
                      </div>
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </DropdownMenu.Item>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="border-t border-slate-700/50 px-4 py-2">
                  <Link
                    to="/notifications"
                    className="block text-center text-xs text-primary hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="rounded-full outline-none focus:ring-2 focus:ring-primary/50">
              <Avatar name={fullName} size="sm" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl"
              sideOffset={5}
              align="end"
            >
              <div className="px-3 py-2 border-b border-slate-700/50 mb-1">
                <p className="text-sm font-medium text-slate-200">{fullName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 outline-none cursor-pointer hover:bg-slate-700/50"
                onSelect={() => window.location.href = ROUTES.PROFILE}
              >
                <User className="h-4 w-4" />
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 outline-none cursor-pointer hover:bg-slate-700/50"
                onSelect={() => window.location.href = ROUTES.SETTINGS}
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-slate-700/50" />
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 outline-none cursor-pointer hover:bg-red-500/10"
                onSelect={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
