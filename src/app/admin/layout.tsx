'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { AdminGuard } from '@/components/admin/admin-guard';
import { BrandLogo } from '@/components/ui/brand-logo';
import {
  Shield,
  LayoutDashboard,
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  ShieldAlert,
  CreditCard,
  Crown,
  Bell,
  FileText,
  UserCog,
  ClipboardList,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  ChevronDown,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Database,
  Sparkles,
  AlertTriangle,
  FileCheck,
  Camera,
  RotateCcw,
  Zap,
  Compass,
  Layout,
  HelpCircle,
  ShieldCheck,
  Newspaper,
  Image as ImageIcon,
  FolderArchive,
  KeyRound,
  Menu,
  X,
} from 'lucide-react';

interface SidebarGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | string;
  }[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, logout } = useAuth();
  const { verificationQueue, moderationReports, refundRequests } = useAdmin();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Members: true,
    Connections: true,
    Communication: true,
    Moderation: true,
    Payments: true,
    CMS: true,
    'System & Security': true,
  });

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const pendingVerificationCount = verificationQueue.filter((v) => v.status === 'PENDING').length;
  const pendingReportsCount = moderationReports.filter((r) => r.status === 'NEW' || r.status === 'UNDER_REVIEW').length;
  const pendingRefundsCount = refundRequests.filter((r) => r.status === 'PENDING').length;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleAdminLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navGroups: SidebarGroup[] = [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
      title: 'Members',
      items: [
        { label: 'All Members', href: '/admin/members', icon: Users },
        {
          label: 'Verification Queue',
          href: '/admin/members/verification',
          icon: UserCheck,
          badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
        },
      ],
    },
    {
      title: 'Connections',
      items: [
        { label: 'Express Interests', href: '/admin/connections/interests', icon: Heart },
        { label: 'Active Matches', href: '/admin/connections/matches', icon: CheckCircle2 },
      ],
    },
    {
      title: 'Communication',
      items: [
        { label: 'Conversations & Chat', href: '/admin/communication/conversations', icon: MessageSquare },
        { label: 'Reported Messages', href: '/admin/communication/reported-messages', icon: AlertTriangle },
        { label: 'Shared Media Audit', href: '/admin/communication/shared-media', icon: Camera },
      ],
    },
    {
      title: 'Moderation',
      items: [
        {
          label: 'User Reports',
          href: '/admin/moderation/reports',
          icon: ShieldAlert,
          badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
        },
        { label: 'Profile Moderation', href: '/admin/moderation/profiles', icon: ShieldCheck },
        { label: 'Photo Approval Queue', href: '/admin/moderation/photos', icon: Camera },
      ],
    },
    {
      title: 'Payments',
      items: [
        { label: 'Membership Plans', href: '/admin/membership/plans', icon: Crown },
        { label: 'Subscribers', href: '/admin/membership/subscribers', icon: Users },
        { label: 'Payment Transactions', href: '/admin/payments/transactions', icon: CreditCard },
        { label: 'Active Subscriptions', href: '/admin/payments/subscriptions', icon: Zap },
        {
          label: 'Refund Requests',
          href: '/admin/payments/refunds',
          icon: RotateCcw,
          badge: pendingRefundsCount > 0 ? pendingRefundsCount : undefined,
        },
      ],
    },
    {
      title: 'CMS',
      items: [
        { label: 'Single Page CRUD Manager', href: '/admin/crud', icon: Database },
        { label: 'CMS Manager', href: '/admin/cms', icon: Compass },
        { label: 'Pages & Content', href: '/admin/cms/pages', icon: FileText },
        { label: 'Homepage Sections', href: '/admin/cms/homepage', icon: Layout },
        { label: 'Banners & Hero', href: '/admin/cms/banners', icon: Sparkles },
        { label: 'Safety Guidelines', href: '/admin/cms/safety', icon: ShieldCheck },
        { label: 'Articles & Blog', href: '/admin/cms/articles', icon: Newspaper },
        { label: 'FAQ Manager', href: '/admin/cms/faq', icon: HelpCircle },
        { label: 'Media Library', href: '/admin/cms/media', icon: ImageIcon },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { label: 'Admin Users & Roles', href: '/admin/admin-users', icon: UserCog },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
        { label: 'Broadcast Notifications', href: '/admin/notifications', icon: Bell },
        { label: 'Roles & Permissions', href: '/admin/roles-permissions', icon: KeyRound },
        { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const renderSidebarContent = () => (
    <>
      {/* Top Brand Header */}
      <div className="h-16 px-4 border-b border-stone-800 flex items-center justify-between bg-stone-950 shrink-0">
        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
          <BrandLogo size="sm" variant="dark" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-extrabold bg-pink-950 text-pink-300 border border-pink-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
            SaaS Admin
          </span>
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 select-none">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups[group.title] !== false;
          return (
            <div key={group.title} className="space-y-1">
              
              {/* Category Header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-widest text-stone-400 hover:text-pink-300 transition-colors"
              >
                <span>{group.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              {/* Menu Items */}
              {isExpanded && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-600 via-pink-700 to-rose-800 text-white shadow-lg border border-pink-500/80'
                            : 'text-stone-300 hover:text-white hover:bg-stone-800/90 border border-transparent hover:border-stone-700/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-pink-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500 text-white shrink-0 shadow-xs">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-stone-800 space-y-2 bg-stone-950 shrink-0">
        <Link href="/" target="_blank">
          <button className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all border border-stone-700 shadow-md">
            <Globe className="w-4 h-4 text-pink-400" />
            <span>View Public Site</span>
          </button>
        </Link>

        <button
          onClick={handleAdminLogout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold bg-red-950 hover:bg-red-900 text-red-200 transition-all border border-red-800 shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <AdminGuard>
      <div className="h-screen w-screen bg-stone-950 text-stone-100 flex overflow-hidden font-sans fixed inset-0 z-40">
        
        {/* Desktop Sidebar (lg:flex) */}
        <aside className="hidden lg:flex w-64 h-full bg-stone-900 border-r border-stone-800 flex-col justify-between shrink-0 shadow-2xl z-50">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Fullscreen Drawer Overlay (lg:hidden) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </div>
        )}

        {/* Right Main Admin View Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-stone-950">
          
          {/* Top Header Bar */}
          <header className="h-16 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 shrink-0 shadow-lg">
            
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-800 text-xs font-bold shrink-0"
              aria-label="Toggle Admin Sidebar Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5 text-pink-400" />}
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Admin Search Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search members, transactions, reports..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              <Link href="/admin/audit-logs">
                <span className="text-xs font-bold text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800">
                  <ClipboardList className="w-4 h-4 text-pink-400" />
                  <span className="hidden sm:inline">Audit Log</span>
                </span>
              </Link>

              <div className="h-5 w-px bg-stone-800 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-600 to-rose-700 text-white font-serif font-bold text-xs flex items-center justify-center shadow-md border border-pink-400">
                  SA
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-xs font-bold text-white block leading-tight">Super Admin</span>
                  <span className="text-[10px] text-pink-400 font-mono block">System Controller</span>
                </div>
              </div>
            </div>

          </header>

          {/* Page Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full max-w-full">
            {children}
          </main>

        </div>

      </div>
    </AdminGuard>
  );
}
