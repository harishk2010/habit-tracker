import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, User, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits', icon: Target, label: 'My Habits' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out successfully'); navigate('/login'); }
    catch { toast.error('Failed to logout'); }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 p-6">
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">HabitForge</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />{label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" />Sign Out
        </button>
      </div>
    </aside>
  );
};
