// src/components/dashboard/DashboardLayout.jsx
import React, { useState } from 'react';
import { 
  Home, 
  Mail, 
  BarChart, 
  Users, 
  PieChart, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  DollarSign

} from 'lucide-react';
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { MdOutlineSettings } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../../url';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext'; // Use our new context
import coinleylogo from '../../assets/Logo.png';

// MenuItem Component - Modified to handle special case for logout
const MenuItem = ({ icon, title, path, collapsed, active, onClick }) => {
  const { darkMode } = useDarkMode();
  
  // If onClick is provided, use a button instead of a Link
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left rounded-xl ${
          darkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-black'
        } font-semibold transition-colors`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="ml-3">{title}</span>}
      </button>
    );
  }
  
  // Regular menu item with Link
  return (
    <Link 
      to={path}
      className={`flex items-center w-full px-4 py-3 text-left rounded-xl ${
        active 
          ? 'bg-[#7042D2] text-white font-semibold' 
          : darkMode
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-black font-semibold'
      } transition-colors`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3">{title}</span>}
    </Link>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode(); // Use our new context
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  console.log("layout user", user);

  // Handle logout function
  const handleLogout = () => {
    // Clear access token from localStorage
    localStorage.removeItem("access_token");
    
    // Call the logout function from AuthContext
    logout();
    
    // Navigate to the home/login page
    navigate("/");
  };

  // Menu items configuration
  const menuItems = [
    { path: "/dashboard", title: "Dashboard", icon: <Home size={20} /> },
    { path: "/merchants", title: "Merchants", icon: <Users size={25} /> },
    { path: "/transactions", title: "Transactions", icon: <HiOutlineCurrencyDollar size={25} /> },
    { path: "/transaction-fees", title: "Transaction Fees", icon: <DollarSign size={20} /> },
    { path: "/settings", title: "Settings", icon: <MdOutlineSettings size={20} /> },

    // Logout is handled separately
  ];

  // Get page title based on current path
  const getPageTitle = () => {
    const page = menuItems.find(item => item.path === currentPath);
    return page ? page.title : "Dashboard";
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-16' : 'w-64'} ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r transition-all duration-300 flex flex-col`}>
        {/* Logo and collapse button */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {!collapsed && <div className="text-xl font-bold"><img src={coinleylogo} className='w-42 object-cover' /></div>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'} p-1 rounded-md`}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 px-2 rounded-xl">
          {menuItems.map((item) => (
            <MenuItem 
              key={item.path}
              icon={item.icon} 
              title={item.title} 
              path={item.path}
              collapsed={collapsed} 
              active={currentPath === item.path}
            />
          ))}
          
          {/* Logout Item - Special handling */}
          <MenuItem 
            icon={<LogOut size={20} />} 
            title="Logout" 
            collapsed={collapsed}
            onClick={handleLogout}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b py-4 px-6 flex items-center justify-between`}>
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'
              } rounded-full`}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className={`p-2 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'
            } rounded-full`}>
              <Bell size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } rounded-full flex items-center justify-center`}>
                <User size={16} />
              </div>
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;