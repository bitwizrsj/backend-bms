import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Users,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, admin } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
    { name: 'Contact Messages', href: '/contacts', icon: Mail },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary-400" />
          <span className="text-white text-xl font-bold">BMS Academy</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <div className="px-3 mt-6">
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center px-2 py-2 text-sm text-gray-300">
              <Users className="mr-3 h-5 w-5" />
              <div>
                <p className="font-medium">{admin?.name}</p>
                <p className="text-xs text-gray-400">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;