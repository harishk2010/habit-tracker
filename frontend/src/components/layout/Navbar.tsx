import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, User, LogOut, Flame, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits', icon: Target, label: 'My Habits' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out'); navigate('/login'); }
    catch { toast.error('Failed to logout'); }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">HabitForge</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-3 border-t border-gray-100 pt-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setIsOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600'}`}
            >
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      )}
    </header>
  );
};
