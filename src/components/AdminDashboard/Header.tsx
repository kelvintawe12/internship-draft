import React from 'react';
import { MenuIcon, BellIcon, UserIcon } from 'lucide-react';
interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}
const Header = ({
  isSidebarOpen,
  setIsSidebarOpen
}: HeaderProps) => {
  return <header className="bg-white border-b border-black/10">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button type="button" className="md:hidden p-2 rounded-md text-black hover:bg-black/5" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Open sidebar">
              <MenuIcon size={24} />
            </button>
            <h1 className="text-xl font-bold ml-2 md:ml-0">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button type="button" className="p-2 rounded-full text-black hover:bg-black/5 relative" aria-label="Notifications">
              <BellIcon size={20} />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <span className="ml-2 font-medium hidden sm:block">
                Admin John
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;