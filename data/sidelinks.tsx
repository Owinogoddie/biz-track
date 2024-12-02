import {
  IconLayoutDashboard,
  IconBox,
  IconCategory,
  IconTruck,
  IconUsers,
  IconShoppingCart,
  IconReceipt,
  IconChartBar,
  IconSettings,
  IconMoneybag,
  IconPackage,
  IconChartLine,
  IconTools,
  IconFlask,
  IconAssembly,
  IconUserCircle,
  IconUsersGroup,
  IconBuildingFactory2,
  IconUserCheck,
  IconUserCog,
  IconBriefcase,
  IconUsersPlus,
  IconUserSearch,
  IconUserPlus,
} from '@tabler/icons-react';
import { DollarSign, Receipt, ChartBar } from "lucide-react";
export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}
export interface SideLink extends NavLink {
  sub?: NavLink[];
}
export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Products',
    label: '',
    href: '/dashboard/products',
    icon: <IconBox size={18} />,
    sub: [
      {
        title: 'Product List',
        label: '',
        href: '/dashboard/products',
        icon: <IconPackage size={18} />,
      },
      {
        title: 'Categories',
        label: '',
        href: '/dashboard/categories',
        icon: <IconCategory size={18} />,
      },
    ]
  },
  {
    title: 'Production',
    label: '',
    href: '/dashboard/production',
    icon: <IconTools size={18} />,
    sub: [
      {
        title: 'Production List',
        label: '',
        href: '/dashboard/production',
        icon: <IconAssembly size={18} />,
      },
      // {
      //   title: 'Formulas',
      //   label: '',
      //   href: '/dashboard/formulas',
      //   icon: <IconFlask size={18} />,
      // },
    ]
  },
  {
    title: 'Inventory',
    label: '',
    href: '/dashboard/inventory',
    icon: <IconShoppingCart size={18} />,
    sub: [
      {
        title: 'Stock Levels',
        label: '',
        href: '/dashboard/inventory/stock',
        icon: <IconBox size={18} />,
      },
      {
        title: 'Restock',
        label: '',
        href: '/dashboard/inventory/restock',
        icon: <IconTruck size={18} />,
      },
    ]
  },
  {
    title: 'Human Resources',
    label: '',
    href: '/dashboard/hr',
    icon: <IconUserPlus size={18} />,
    sub: [
      {
        title: 'Full-Time Employees',
        label: '',
        href: '/dashboard/hr/employees',
        icon: <IconUserCheck size={18} />,
      },
      {
        title: 'Casual Workers',
        label: '',
        href: '/dashboard/hr/casual-workers',
        icon: <IconUserSearch size={18} />,
      },
      {
        title: 'Contractors',
        label: '',
        href: '/dashboard/hr/contractors',
        icon: <IconBriefcase size={18} />,
      },
      {
        title: 'Payroll',
        label: '',
        href: '/dashboard/hr/payroll',
        icon: <IconMoneybag size={18} />,
      },
    ]
  },
  {
    title: 'Suppliers & Partnerships',
    label: '',
    href: '/dashboard/suppliers',
    icon: <IconTruck size={18} />,
    sub: [
      {
        title: 'Supplier List',
        label: '',
        href: '/dashboard/suppliers/list',
        icon: <IconUsers size={18} />,
      },
      {
        title: 'Supplier Contracts',
        label: '',
        href: '/dashboard/suppliers/contracts',
        icon: <IconReceipt size={18} />,
      },
      {
        title: 'Partner Management',
        label: '',
        href: '/dashboard/suppliers/partners',
        icon: <IconUsersPlus size={18} />,
      },
    ]
  },
  {
    title: 'Sales',
    label: '',
    href: '/dashboard/sales',
    icon: <IconReceipt size={18} />,
    sub: [
      {
        title: 'Sales History',
        label: '',
        href: '/dashboard/reports/sales',
        icon: <IconChartBar size={18} />,
      },
      {
        title: 'Create Sale',
        label: '',
        href: '/dashboard/sales',
        icon: <IconShoppingCart size={18} />,
      },
    ]
  },
  {
    title: 'Customers',
    label: '',
    href: '/dashboard/customers',
    icon: <IconUsers size={18} />,
    sub: [
      {
        title: 'Customer List',
        label: '',
        href: '/dashboard/customers/list',
        icon: <IconUsers size={18} />,
      },
      {
        title: 'Customer Debts',
        label: '',
        href: '/dashboard/customers/debts',
        icon: <IconMoneybag size={18} />,
      },
    ]
  },
  {
    title: 'Debt Management',
    label: '',
    href: '/dashboard/debts',
    icon: <DollarSign size={18} />,
    sub: [
      {
        title: 'Overview',
        label: '',
        href: '/dashboard/debts',
        icon: <ChartBar size={18} />,
      },
      {
        title: 'Transactions',
        label: '',
        href: '/dashboard/debts',
        icon: <Receipt size={18} />,
      }
    ]
  },
  {
    title: 'People',
    label: '',
    href: '/dashboard/people',
    icon: <IconUsersGroup size={18} />,
    sub: [
      {
        title: 'Employees',
        label: '',
        href: '/dashboard/employees',
        icon: <IconUserCheck size={18} />,
      },
      {
        title: 'Casual Workers',
        label: '',
        href: '/dashboard/workers',
        icon: <IconBriefcase size={18} />,
      },
      {
        title: 'Departments',
        label: '',
        href: '/dashboard/departments',
        icon: <IconBuildingFactory2 size={18} />,
      },
      // {
      //   title: 'Roles',
      //   label: '',
      //   href: '/dashboard/people/roles',
      //   icon: <IconUserCog size={18} />,
      // }
    ]
  },
  {
    title: 'Suppliers',
    label: '',
    href: '/dashboard/suppliers',
    icon: <IconTruck size={18} />,
    sub: [
      {
        title: 'Supplier List',
        label: '',
        href: '/dashboard/suppliers/list',
        icon: <IconUserCircle size={18} />,
      },
      {
        title: 'Purchase Orders',
        label: '',
        href: '/dashboard/suppliers/orders',
        icon: <IconReceipt size={18} />,
      },
    ]
  },
  {
    title: 'Reports',
    label: '',
    href: '/dashboard/reports',
    icon: <IconChartLine size={18} />,
    sub: [
      {
        title: 'Sales Report',
        label: '',
        href: '/dashboard/reports/sales',
        icon: <IconChartBar size={18} />,
      },
      {
        title: 'Inventory Report',
        label: '',
        href: '/dashboard/reports/inventory',
        icon: <IconBox size={18} />,
      },
    ]
  },
  {
    title: 'Settings',
    label: '',
    href: '/dashboard/settings',
    icon: <IconSettings size={18} />,
  },
];