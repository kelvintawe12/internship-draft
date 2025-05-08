import React, { useState } from 'react';
import Sidebar from '../components/AdminDashboard/Sidebar';
import Header from '../components/AdminDashboard/Header';
import Overview from '../components/AdminDashboard/Overview';
import Orders from '../components/AdminDashboard/Orders';
import Dispatches from '../components/AdminDashboard/Dispatches';
import Customers from '../components/AdminDashboard/Customers';
import Payments from '../components/AdminDashboard/Payments';
import Inventory from '../components/AdminDashboard/Inventory';
import Analytics from '../components/AdminDashboard/Analytics';
import Settings from '../components/AdminDashboard/Settings';
export function dashboardRoutes() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'orders':
        return <Orders />;
      case 'dispatches':
        return <Dispatches />;
      case 'customers':
        return <Customers />;
      case 'payments':
        return <Payments />;
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };
  return <div className="flex h-screen bg-white text-black">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderActiveSection()}
        </main>
        <footer className="py-4 px-6 border-t border-black/10 text-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p>© 2025 Mount Meru SoyCo Rwanda</p>
            <p className="hidden md:block">v1.0.0</p>
          </div>
        </footer>
      </div>
    </div>;
}

export default dashboardRoutes;