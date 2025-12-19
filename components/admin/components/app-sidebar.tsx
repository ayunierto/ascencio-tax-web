'use client';

import * as React from 'react';
import {
  type Icon,
  IconBackpack,
  IconCalendar,
  IconCalendarClock,
  IconClock,
  IconDashboard,
  IconFolder,
  IconSettings,
  IconSettings2,
  IconUsers,
} from '@tabler/icons-react';

import { NavUser } from '@/components/admin/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { BasicUser } from '@/lib/actions/auth/me';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarNavGroup } from './nav-group';
import { Dictionary } from '@/lib/i18n/dictionaries';

const navGroupLinks: NavGroupLink[] = [
  {
    label: 'Overview',
    links: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: IconDashboard,
      },
    ],
  },
  {
    label: 'Management',
    links: [{ title: 'Users', url: '/admin/users', icon: IconUsers }],
  },
  {
    label: 'Bookings',
    links: [
      {
        title: 'Services',
        url: '/admin/services',
        icon: IconFolder,
      },
      {
        title: 'Appointments',
        url: '/admin/appointments',
        icon: IconCalendar,
      },
      { title: 'Staff', url: '/admin/staff', icon: IconUsers },
      { title: 'Schedules', url: '/admin/schedules', icon: IconClock },
    ],
  },
  {
    className: 'mt-auto',
    links: [{ title: 'Settings', url: '/admin/settings', icon: IconSettings }],
  },
];

export interface NavGroupLink {
  label?: string;
  className?: string;
  links: LinkItem[];
}

interface LinkItem {
  title: string;
  url: string;
  icon: Icon;
}
[];

interface AppSidebarProps {
  user: BasicUser;
  dict: Dictionary;
}

export function AppSidebar({
  user,
  dict,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Image
                  src="/images/simple-logo.png"
                  alt="Ascencio Tax Inc."
                  width={32}
                  height={32}
                  className="size-8! rounded-2xl"
                />
                <span className="text-base font-semibold">
                  {process.env.NEXT_PUBLIC_COMPANY_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}

        {navGroupLinks.map((group) => (
          <SidebarNavGroup
            key={group.links[0].title}
            label={group.label}
            items={group.links}
            className={group.className}
          />
        ))}

        {/* <SidebarNavGroup items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          dict={dict}
          user={{
            name: user.firstName + ' ' + user.lastName,
            avatar: user.imageUrl,
            email: user.email,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
