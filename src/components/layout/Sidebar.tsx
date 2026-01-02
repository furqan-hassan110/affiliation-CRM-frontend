import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  ShoppingCart,
  X,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('admin' | 'agent')[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'agent'],
  },
  {
    label: 'Agents',
    path: '/agents',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: UserCircle,
    roles: ['admin', 'agent'],
  },
  {
    label: 'Create Order',
    path: '/create-order',
    icon: ShoppingCart,
    roles: ['agent'],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Link2 className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              AffiliateCRM
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredNavItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/60">
            © 2024 AffiliateCRM
          </p>
        </div>
      </aside>
    </>
  );
}
