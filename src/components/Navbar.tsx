'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useApi';
import { authService } from '@/services/auth.service';
import { useToast } from '@/providers/ToastProvider';
import { Gavel, User, LogOut, LayoutDashboard, ListPlus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  // Don't render navbar on auth pages
  if (isAuthPage) return null;
  
  const { data: user } = useCurrentUser();
  const toast = useToast();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
  };

  const navLinks = [
    { href: '/', label: 'Browse Auctions', icon: ShoppingBag },
    ...(user
      ? [
          { href: '/my-listings', label: 'My Listings', icon: ListPlus },
          ...(user.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin', icon: LayoutDashboard }] : []),
        ]
      : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Gavel className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">BidHub</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}

            {/* User Menu */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/profile'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
