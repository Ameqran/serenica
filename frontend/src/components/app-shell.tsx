'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarClock,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  NotebookTabs,
  UserRound,
  UsersRound
} from 'lucide-react';
import { useAuth } from './auth-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: UsersRound },
  { href: '/bookings', label: 'Bookings', icon: CalendarClock },
  { href: '/sessions', label: 'Sessions Editor', icon: ClipboardCheck },
  { href: '/notes', label: 'Note Library', icon: NotebookTabs }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userName, logout } = useAuth();

  return (
    <div className="shell-root">
      <aside className="shell-sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <h1>Serenica</h1>
            <p>Clinical Workspace</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link className={`nav-item ${active ? 'active' : ''}`} href={item.href} key={item.href}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="user-icon"><UserRound size={16} /></div>
            <div>
              <strong>{userName}</strong>
              <p>Authenticated via Keycloak</p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} type="button">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="shell-main">{children}</main>
    </div>
  );
}
