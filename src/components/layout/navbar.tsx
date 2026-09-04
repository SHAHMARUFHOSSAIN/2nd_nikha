'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useAuth } from '@/lib/auth-context';
import { useCommunication } from '@/lib/communication-context';
import { NAV_ITEMS } from '@/lib/constants';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';
import { MOCK_PROFILES } from '@/data/mock-data';
import {
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  Shield,
  MessageSquare,
  Heart,
  Crown,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  CreditCard,
  Sparkles,
  Globe,
  Star,
  Bell,
  Settings,
  Search,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userRole, logout } = useAuth();
  const communication = useCommunication();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = MOCK_PROFILES[0]; // Anika Rahman
  const totalUnread = (communication?.conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide public navbar inside Admin Portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="bg-white border-b border-pink-100 sticky top-0 z-50 shadow-xs">
      <Container size="xl">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium text-sm transition-colors ${
                  pathname === item.href
                    ? 'text-pink-600 font-bold'
                    : 'text-stone-700 hover:text-pink-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <CurrencySwitcher />
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                
                {/* Inbox Icon */}
                <Link
                  href="/member/messages"
                  className="relative p-2.5 rounded-full text-stone-700 hover:text-pink-600 hover:bg-pink-50 transition-all border border-stone-200"
                  title="Messages Inbox"
                >
                  <MessageSquare className="w-5 h-5 text-stone-700" />
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {totalUnread}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-stone-200 hover:border-pink-300 hover:bg-pink-50/50 transition-all shadow-xs"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-pink-200 bg-pink-50 shrink-0">
                      <Image
                        src={currentUser.photoUrl}
                        alt={currentUser.fullName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    <div className="text-left hidden lg:block">
                      <span className="font-serif font-bold text-xs text-stone-900 block leading-tight">
                        {currentUser.fullName.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-semibold text-pink-700 block">
                        {userRole === 'PREMIUM' ? '👑 Premium' : 'Free Member'}
                      </span>
                    </div>

                    <ChevronDown className="w-4 h-4 text-stone-400 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-pink-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-stone-100 space-y-0.5">
                        <p className="font-serif font-bold text-sm text-stone-900">
                          {currentUser.fullName}
                        </p>
                        <p className="text-xs text-stone-500 truncate">anika.rahman@example.com</p>
                        <span className="inline-flex items-center gap-1 mt-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          👑 {userRole} Membership
                        </span>
                      </div>

                      <div className="py-1 text-xs text-stone-700">
                        <Link
                          href="/member"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-pink-600" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/member/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <User className="w-4 h-4 text-pink-600" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/search"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <Search className="w-4 h-4 text-pink-600" />
                          <span>Discover Matches</span>
                        </Link>

                        <Link
                          href="/member/shortlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span>Shortlist</span>
                        </Link>

                        <Link
                          href="/member/notifications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Bell className="w-4 h-4 text-pink-600" />
                            <span>Notifications</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-pink-800 font-bold">3</span>
                        </Link>

                        <Link
                          href="/member/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-pink-600" />
                          <span>Settings</span>
                        </Link>

                        <Link
                          href="/member/subscription"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-pink-50 hover:text-pink-700 transition-colors border-t border-stone-100"
                        >
                          <CreditCard className="w-4 h-4 text-pink-600" />
                          <span>Manage Subscription</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4 text-stone-400" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-2 border-pink-200 text-pink-800 hover:bg-pink-50"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="wine"
                    size="sm"
                    className="rounded-full shadow-md shadow-pink-900/20 px-5"
                    leftIcon={<UserPlus className="w-4 h-4 text-white" />}
                  >
                    Register Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Currency Switcher + Hamburger Menu Trigger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <CurrencySwitcher />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-pink-600 rounded-xl border border-stone-200 focus:outline-none"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-pink-600" /> : <Menu className="w-6 h-6 text-stone-800" />}
            </button>
          </div>

        </div>
      </Container>

      {/* Mobile Hamburger Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-pink-200 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <Container size="xl" className="py-6 space-y-6">
            
            {/* Mobile Country & Currency Switcher Bar */}
            <div className="p-3.5 bg-pink-50/80 rounded-2xl border border-pink-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-950">
                <Globe className="w-4 h-4 text-pink-600" />
                <span>Region & Currency:</span>
              </div>
              <CurrencySwitcher variant="navbar" />
            </div>

            {/* Main Navigation Links */}
            <nav className="flex flex-col space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 px-3 pb-1">
                Navigation Menu
              </span>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-between ${
                    pathname === item.href
                      ? 'bg-pink-50 text-pink-700 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-pink-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.label === 'AI Match' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-pink-800 font-bold border border-pink-200">
                      ✨ AI Match
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Account Controls Section */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-pink-50/60 rounded-2xl border border-pink-100">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-pink-300 shrink-0">
                      <Image
                        src={currentUser.photoUrl}
                        alt={currentUser.fullName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-900">{currentUser.fullName}</h4>
                      <p className="text-xs text-pink-700 font-medium">👑 {userRole} Member</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <Link
                      href="/member"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-center hover:bg-pink-50 hover:text-pink-700"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/member/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-center hover:bg-pink-50 hover:text-pink-700"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/search"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-center hover:bg-pink-50 hover:text-pink-700"
                    >
                      Discover Matches
                    </Link>

                    <Link
                      href="/member/shortlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-center hover:bg-pink-50 hover:text-pink-700"
                    >
                      Shortlist
                    </Link>

                    <Link
                      href="/member/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-center hover:bg-pink-50 hover:text-pink-700 flex items-center justify-center gap-1"
                    >
                      <span>Notifications</span>
                      <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center">
                        3
                      </span>
                    </Link>

                    <Link
                      href="/member/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-center hover:bg-pink-50 hover:text-pink-700"
                    >
                      Settings
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Account</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center rounded-xl border-pink-300 text-pink-800">
                      Login
                    </Button>
                  </Link>

                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="wine" className="w-full justify-center rounded-xl shadow-md">
                      Register Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>

          </Container>
        </div>
      )}
    </header>
  );
}
