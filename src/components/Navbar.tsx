import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Search,
  Bookmark,
  Briefcase,
  Bell,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const {
    currentUser,
    switchUserRole,
    logoutUser,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'catalogue', label: 'Catalogue des opportunités' },
    { id: 'methodology', label: 'Méthode de vérification' },
    { id: 'scam-prevention', label: 'Prévention des arnaques' },
    { id: 'about', label: 'À propos' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Opportunity<span className="text-blue-600">Trust</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 block leading-none">
                Bénin & International
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === link.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions: Role Quick-Switcher, Notifications, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher for demonstration */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-slate-100 border border-slate-200 rounded-lg p-1">
              <span className="text-slate-500 font-medium px-1.5">Rôle :</span>
              <button
                onClick={() => switchUserRole('visitor')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  !currentUser ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visiteur
              </button>
              <button
                onClick={() => switchUserRole('user')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  currentUser?.role === 'user'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Candidat
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notifications (if logged in) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  aria-label="Centre de notifications"
                  className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popup */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Notifications ({notifications.length})
                      </span>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-blue-600 hover:underline"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center">Aucune notification.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                              n.read
                                ? 'bg-slate-50/70 border-slate-100 text-slate-600'
                                : 'bg-blue-50/50 border-blue-100 text-slate-800 font-medium'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-semibold text-slate-900 text-[11px]">{n.title}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Console Shortcut button */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  currentView === 'admin'
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Console Admin
              </button>
            )}

            {/* Candidate Dashboard Shortcut */}
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Mes Candidatures
              </button>
            )}

            {/* Auth Actions / Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[120px]">
                    {currentUser.displayName}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName.charAt(0)}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.displayName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {currentUser.role === 'admin' ? 'Administrateur' : 'Candidat'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Tableau de bord & Candidatures
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      Profil & Confidentialité
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-emerald-800 font-semibold hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        Console d'audit Admin
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Connexion
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu de navigation"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-2">
            <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Rôle de test :</span>
              <div className="flex gap-1">
                <button
                  onClick={() => switchUserRole('visitor')}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    !currentUser ? 'bg-blue-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  Visiteur
                </button>
                <button
                  onClick={() => switchUserRole('user')}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currentUser?.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  Candidat
                </button>
                <button
                  onClick={() => switchUserRole('admin')}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currentUser?.role === 'admin' ? 'bg-emerald-700 text-white' : 'bg-slate-100'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                    currentView === link.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {currentUser && (
                <>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-blue-700 bg-blue-50/50 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Mes Candidatures & Favoris
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Console d'administration
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
