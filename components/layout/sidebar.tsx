'use client';
import React, { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { getSessionStorageItem } from '@/utils/localStorage';
import { NavItem } from '@/types'; // Adjust the import path as necessary
import { Icons } from '@/components/icons';

interface PermissionDetail {
  actionName: string;
  isAllowed: boolean;
  href: string;
  isInSidebar: boolean;
}

interface Permission {
  permissionId: string;
  moduleName: string;
  icon: keyof typeof Icons; // This should match your defined icon keys
  details: PermissionDetail[];
}

export default function Sidebar({ className }: { className?: string }) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  useEffect(() => {
    const permissions: Permission[] = getSessionStorageItem('permission') || [];

    const dynamicItems = permissions.flatMap((permission) => 
      permission.details
        .filter(detail => detail.isInSidebar)
        .map(detail => ({
          title: permission.moduleName,
          href: detail.href,
          icon: permission.icon as keyof typeof Icons, // Ensure the icon is of the correct type
          isAllowed: detail.isAllowed,
        }))
    );

    // Define static nav items
    const staticItems: NavItem[] = [
      { title: 'Dashboard', href: '/dashboard', icon: 'dashboard' }, // Example static item
        ];

    // Concatenate static and dynamic items
    const allNavItems = staticItems.concat(dynamicItems);

    setNavItems(allNavItems);
  }, []);

  return (
    <nav
      className={cn(
        `relative hidden h-screen flex-none border-r pt-20 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}