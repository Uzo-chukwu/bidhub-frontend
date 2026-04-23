'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  // Don't render footer on auth pages
  if (isAuthPage) return null;
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">BidHub</span>
            <span className="text-sm text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} All rights reserved</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
