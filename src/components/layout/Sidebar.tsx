import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { MenuItemType } from '../../types';
import logo from "/images/Logo.png"
import overview from "/images/overview.png"
import product from "/images/product.png"
import profile from "/images/profile.png"
import customer from "/images/customer.png"
import help from "/images/help.png"
import setting from "/images/setting.png"
import logout from "/images/logout.png"
import message from "/images/message.png"
import diamond from "/images/Upgrade Icon Container.png"
import sun from "/images/Sun.svg"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItemType[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: overview,
    href: '/dashboard',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: profile,
    href: '/profile',
  },
  {
    id: 'product',
    label: 'Product',
    icon: product,
    href: '/products',
    isExpandable: true,
    children: [
      { id: 'smartwatch', label: 'Smartwatch', icon: '', href: '/products/smartwatch' },
      { id: 'drone', label: 'Drone', icon: '', href: '/products/drone' },
      { id: 'speaker', label: 'Speaker', icon: '', href: '/products/speaker' },
      { id: 'chargers', label: 'Chargers', icon: '', href: '/products/chargers' },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: customer,
    href: '/customers',
  },
  {
    id: 'message',
    label: 'Message',
    icon: message,
    href: '/messages',
    badge: 20,
  },
];

const accountItems: MenuItemType[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: setting,
    href: '/settings',
  },
  {
    id: 'help',
    label: 'Help',
    icon: help,
    href: '/help',
  },
  {
    id: 'logout',
    label: 'Log Out',
    icon: logout,
    href: '/logout',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['product']);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    // You can add theme switching logic here
    console.log('Theme toggled:', !isDarkMode ? 'dark' : 'light');
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const isParentActive = (item: MenuItemType) => {
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return isActive(item.href);
  };

  const renderMenuItem = (item: MenuItemType) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const activeItem = isParentActive(item);

    return (
      <li key={item.id}>
        {hasChildren ? (
          <div className='max-w-[260px] overflow-hidden'>
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-[10px] outline-none transition-colors ${
                activeItem
                  ? 'text-secondary-200 bg-white'
                  : 'text-secondary-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                {item.icon && <img src={item.icon} alt={item.label} className="w-5 h-5 mr-3" />}
                {item.label}
               
              </div>
              
            </button>
            {isExpanded && item.children && (
              <ul className="ml-6 mt-2 space-y-1">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <NavLink
                      to={child.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 outline-none  text-sm font-medium rounded-[10px] ${
                          isActive
                            ? 'text-secondary-200 bg-white'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-secondary-200'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <NavLink
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm outline-none font-medium rounded-[10px] transition-colors ${
                isActive
                  ? 'text-secondary-200 bg-white border border-white-100'
                  : 'text-secondary-200 hover:bg-gray-100'
              }`
            }
          >
            {item.icon && <img src={item.icon} alt={item.label} className="w-5 h-5 mr-3" />}
            {item.label}
            {item.badge && (
              <span className="ml-auto px-2 opacity-50 py-0.5">
                {item.badge}
              </span>
            )}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <div
      className={` ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-[260px] bg-white-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between m-4">
          <NavLink to="/" className="">
            <img src={logo} alt="" className='w-[76px] h-[30px]' />
          </NavLink>
          <div className="flex items-center">
            {/* Sun/Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 bg-white border border-white-200 rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Toggle theme"
            >
              <img src={sun} alt="Theme" className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="lg:hidden text-secondary-200 "
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {/* General Menu */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              GENERAL MENU
            </p>
            <ul className="space-y-1">{menuItems.map(renderMenuItem)}</ul>
          </div>

          {/* Account Menu */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              ACCOUNT
            </p>
            <ul className="space-y-1">{accountItems.map(renderMenuItem)}</ul>
          </div>
        </nav>
      </div>

      {/* Promotional Card - Fixed at bottom */}
      <div className="p-4 mt-auto text-secondary-200">
        <div className="bg-white border border-white-100 rounded-lg p-3 relative overflow-hidden">
         
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <div className="rounded-lg flex items-center justify-center mr-3">
               <img src={diamond} alt="" className='w-[28px] h-[28px]'/>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Activate Super</h3>
                <p className="text-[11px]">Unlock All features on Gilsanum</p>
              </div>
            </div>
            <button className="w-full bg-primary-500 border border-primary-600 text-white font-medium py-2 px-4 rounded-lg text-sm">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
