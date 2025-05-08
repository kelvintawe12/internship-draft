import React from 'react';
import { HomeIcon, ShoppingCartIcon, TruckIcon, UsersIcon, CreditCardIcon, PackageIcon, BarChart3Icon, SettingsIcon, LogOutIcon, ChevronLeftIcon, ChevronRightIcon, GlobeIcon } from 'lucide-react';
interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}
const Sidebar = ({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen
}: SidebarProps) => {
  const navItems = [{
    id: 'overview',
    label: 'Overview',
    icon: <HomeIcon size={20} />
  }, {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCartIcon size={20} />
  }, {
    id: 'dispatches',
    label: 'Dispatches',
    icon: <TruckIcon size={20} />
  }, {
    id: 'customers',
    label: 'Customers',
    icon: <UsersIcon size={20} />
  }, {
    id: 'payments',
    label: 'Payments',
    icon: <CreditCardIcon size={20} />
  }, {
    id: 'inventory',
    label: 'Inventory',
    icon: <PackageIcon size={20} />
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3Icon size={20} />
  }, {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon size={20} />
  }];
  return <>
      {/* Desktop Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-black text-white h-full transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {isSidebarOpen ? <h1 className="text-xl font-bold">Mount Meru SoyCo</h1> : <h1 className="text-xl font-bold">MM</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-full hover:bg-white/10" aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            {isSidebarOpen ? <ChevronLeftIcon size={20} /> : <ChevronRightIcon size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(item => <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${activeSection === item.id ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`} aria-current={activeSection === item.id ? 'page' : undefined}>
              <span className="mr-3">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>)}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center w-full px-3 py-2 rounded-md text-white hover:bg-white/10">
            <span className="mr-3">
              <LogOutIcon size={20} />
            </span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
          <button className="flex items-center w-full px-3 py-2 mt-2 rounded-md text-white hover:bg-white/10">
            <span className="mr-3">
              <GlobeIcon size={20} />
            </span>
            {isSidebarOpen && <span>English</span>}
          </button>
        </div>
      </div>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setIsSidebarOpen(false)} />}
      {/* Mobile Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-black text-white transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="text-xl font-bold">Mount Meru SoyCo</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-full hover:bg-white/10" aria-label="Close sidebar">
            <ChevronLeftIcon size={20} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(item => <button key={item.id} onClick={() => {
          setActiveSection(item.id);
          setIsSidebarOpen(false);
        }} className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${activeSection === item.id ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`} aria-current={activeSection === item.id ? 'page' : undefined}>
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>)}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center w-full px-3 py-2 rounded-md text-white hover:bg-white/10">
            <span className="mr-3">
              <LogOutIcon size={20} />
            </span>
            <span>Logout</span>
          </button>
          <button className="flex items-center w-full px-3 py-2 mt-2 rounded-md text-white hover:bg-white/10">
            <span className="mr-3">
              <GlobeIcon size={20} />
            </span>
            <span>English</span>
          </button>
        </div>
      </div>
    </>;
};
export default Sidebar;