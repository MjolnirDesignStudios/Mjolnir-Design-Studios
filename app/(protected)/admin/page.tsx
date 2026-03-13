'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, Users, FileText, Download, Search, Hammer, CheckCircle, Clock, XCircle, Home, Sun, Moon, User, LogOut, Settings, Bell, HelpCircle, BarChart3, Briefcase, Plus, RefreshCw, Mail, Edit } from 'lucide-react';
import { supabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

// Types
type PaymentStatus = 'paid' | 'pending' | 'failed';
type ContractStatus = 'active' | 'expiring';
type WorkshopStatus = 'confirmed' | 'pending' | 'cancelled';

// Real data interfaces
interface Payment {
  id: string;
  client: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  invoiceId: string;
  description: string;
  stripePaymentId?: string;
}

interface Contract {
  id: string;
  client: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  type: string;
  monthlyAmount: number;
}

interface WorkshopSignup {
  id: string;
  name: string;
  email: string;
  workshopType: 'live' | 'webinar';
  scheduledDate: string;
  status: WorkshopStatus;
  amount: number;
  source: 'calendly' | 'qr' | 'direct';
  calendlyEventId?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === 'dark';

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      role?: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Real data state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [workshopSignups, setWorkshopSignups] = useState<WorkshopSignup[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    company: string;
    role: string;
  }>({
    name: '',
    email: '',
    company: 'Mjolnir Design Studios',
    role: 'Administrator',
  });

  // Check Supabase authentication and admin role
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }

      // Verify is_admin flag from the profiles table (server-side authoritative check)
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        router.push('/'); // Redirect non-admin users
        return;
      }

      setUser(user);
      // Populate userData from the authenticated session — never from hardcoded defaults
      setUserData(prev => ({
        ...prev,
        name:  user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
        email: user.email || '',
      }));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Load real data from APIs
  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      // Load workshop signups from Supabase
      const { data: signups, error: signupsError } = await supabaseClient
        .from('workshop_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (!signupsError && signups) {
        setWorkshopSignups(signups.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          workshopType: s.workshop_type as 'live' | 'webinar',
          scheduledDate: s.scheduled_date,
          status: s.status as WorkshopStatus,
          amount: s.amount,
          source: s.source as 'calendly' | 'qr' | 'direct',
          calendlyEventId: s.calendly_event_id
        })));
      }

      // Load payments from Stripe API
      try {
        const paymentsResponse = await fetch('/api/admin/payments?limit=50');
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          setPayments(paymentsData.payments || []);
        }
      } catch (stripeError) {
        console.error('Error loading Stripe payments:', stripeError);
        // Fallback to workshop signups as payments
        const paymentData: Payment[] = signups?.map(s => ({
          id: `pay_${s.id}`,
          client: s.name,
          amount: s.amount,
          status: s.status === 'confirmed' ? 'paid' : 'pending',
          date: new Date(s.created_at).toISOString().split('T')[0],
          invoiceId: `WS-${s.id}`,
          description: `${s.workshop_type === 'live' ? 'Live Workshop' : 'Webinar'} - ${s.name}`,
          stripePaymentId: s.stripe_payment_id
        })) || [];
        setPayments(paymentData);
      }

      // Load HubSpot contacts
      try {
        const contactsResponse = await fetch('/api/admin/contacts?limit=50');
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          // contacts are handled elsewhere
        }
      } catch (hubspotError) {
        console.error('Error loading HubSpot contacts:', hubspotError);
        // Keep empty contacts array
      }

      // Mock contracts data (you'd load from your CRM/database)
      setContracts([
        { id: 'con_001', client: 'Acme Corp', value: 60000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active', type: 'Monthly Retainer', monthlyAmount: 5000 },
        { id: 'con_002', client: 'TechStart Inc', value: 42000, startDate: '2024-01-15', endDate: '2024-12-31', status: 'active', type: 'Project-based', monthlyAmount: 3500 },
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="text-center">
          <Hammer className="w-12 h-12 animate-pulse text-gold mx-auto mb-4" />
          <div className="text-xl text-silver-100">Loading Mjolnir Command Center...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate metrics from real data
  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const failedPayments = payments.filter(p => p.status === 'failed');

  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = failedPayments.reduce((sum, p) => sum + p.amount, 0);

  const successfulCount = paidPayments.length;
  const pendingCount = pendingPayments.length;
  const failedCount = failedPayments.length;

  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const totalContractValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const expiringContracts = contracts.filter(c => c.status === 'expiring').length;

  const statusColors = {
    paid: darkMode ? '#10b981' : '#059669',
    pending: darkMode ? '#f59e0b' : '#d97706',
    failed: darkMode ? '#ef4444' : '#dc2626',
    active: darkMode ? '#3b82f6' : '#2563eb',
    gold: darkMode ? '#D4AF37' : '#C5A028',
    confirmed: darkMode ? '#10b981' : '#059669',
    cancelled: darkMode ? '#ef4444' : '#dc2626',
  };

  const paymentStatusData = [
    { name: 'Paid', value: successfulCount, color: statusColors.paid },
    { name: 'Pending', value: pendingCount, color: statusColors.pending },
    { name: 'Failed', value: failedCount, color: statusColors.failed },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Monthly revenue calculation from payments
  const monthlyRevenue = (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map(month => {
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.date);
        return paymentDate.getFullYear() === currentYear &&
               paymentDate.toLocaleString('default', { month: 'short' }) === month;
      });
      const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      return {
        month,
        revenue,
        target: 35000, // You can adjust targets
        expenses: Math.round(revenue * 0.4) // Estimate expenses as 40% of revenue
      };
    });
    return monthlyData;
  })();

  const StatCard = ({ icon: Icon, label, value, trend, iconColor, subtitle, onClick }: {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    value: string;
    trend?: number;
    iconColor: string;
    subtitle?: string;
    onClick?: () => void;
  }) => (
    <div className="mjolnir-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className={iconColor} style={{ width: '60px', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Ubuntu Mono, monospace', color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1 }}>{value}</div>
          {subtitle && <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{subtitle}</div>}
          {trend !== undefined && (
            <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Ubuntu Mono, monospace', color: trend > 0 ? statusColors.paid : trend < 0 ? statusColors.failed : 'var(--status-neutral)' }}>
              {trend > 0 ? 'â†‘' : trend < 0 ? 'â†“' : 'â†’'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }: { status: 'paid' | 'pending' | 'failed' | 'active' | 'gold' | 'confirmed' | 'cancelled' }) => (
    <span style={{
      backgroundColor: `${statusColors[status]}${darkMode ? '20' : '15'}`,
      color: statusColors[status],
      border: `1px solid ${statusColors[status]}${darkMode ? '40' : '30'}`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'capitalize'
    }}>
      {status === 'paid' && <CheckCircle size={14} />}
      {status === 'pending' && <Clock size={14} />}
      {status === 'failed' && <XCircle size={14} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const sidebarLinks = [
    { label: 'Overview', icon: Home, view: 'overview' },
    { label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { label: 'Payments', icon: DollarSign, view: 'payments' },
    { label: 'Contracts', icon: FileText, view: 'contracts' },
    { label: 'Clients', icon: Users, view: 'clients' },
    { label: 'Workshops', icon: Hammer, view: 'workshops' },
  ];

  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <style>{`
        .dashboard-container { transition: background-color 0.3s ease; }

        /* Top Navbar - FIXED */
        .top-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: var(--bg-elevated);
          border-bottom: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 100;
          box-shadow: 0 2px 8px var(--shadow);
        }
        .navbar-left { display: flex; align-items: center; gap: 32px; }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }
        .logo-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .logo-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          transition: transform 0.2s;
        }
        .logo-icon:hover { transform: scale(1.05); }
        .logo-text {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .nav-icon-btn {
          width: 40px;
          height: 40px;
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
          position: relative;
        }
        .nav-icon-btn:hover {
          background: var(--bg-secondary);
          border-color: var(--mjolnir-gold);
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .nav-icon-btn.active {
          background: var(--mjolnir-gold);
          border-color: var(--mjolnir-gold);
          color: white;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-elevated);
        }

        .user-menu-container { position: relative; }
        .user-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-button:hover {
          background: var(--bg-secondary);
          border-color: var(--mjolnir-gold);
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }
        .user-info { text-align: left; }
        .user-name { font-size: 14px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
        .user-role { font-size: 12px; color: var(--text-tertiary); line-height: 1.2; }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: var(--bg-elevated);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 8px 32px var(--shadow);
          padding: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s;
          z-index: 1000;
        }
        .user-dropdown.show { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }
        .dropdown-item:hover { background: rgba(212, 175, 55, 0.1); color: var(--mjolnir-gold); }
        .dropdown-divider { height: 2px; background: var(--border-color); margin: 8px 0; }
        .dropdown-item.danger { color: #ef4444; }
        .dropdown-item.danger:hover { background: rgba(239, 68, 68, 0.1); }

        /* Main Layout */
        .main-layout { display: flex; margin-top: 72px; min-height: calc(100vh - 72px); }

        /* Premium Aceternity Sidebar */
        .aceternity-sidebar {
          position: relative;
          height: calc(100vh - 72px);
          background: var(--bg-secondary);
          border-right: 2px solid var(--border-color);
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          gap: 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          cursor: pointer;
          position: relative;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 4px solid transparent;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar-link:hover {
          background: rgba(212, 175, 55, 0.1);
          color: var(--mjolnir-gold);
          border-left-color: var(--mjolnir-gold);
          padding-left: 24px;
        }

        .sidebar-link.active {
          background: rgba(212, 175, 55, 0.15);
          color: var(--mjolnir-gold);
          border-left-color: var(--mjolnir-gold);
          font-weight: 700;
        }

        .sidebar-link-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-link-text {
          margin-left: 14px;
        }

        .main-content { flex: 1; overflow-y: auto; background: var(--bg-primary); }
        .content-header {
          background: var(--bg-elevated);
          border-bottom: 2px solid var(--border-color);
          padding: 28px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .page-title { font-size: 32px; font-weight: 700; color: var(--text-primary); }
        .page-subtitle { font-size: 15px; color: var(--text-tertiary); margin-top: 4px; font-weight: 400; }
        .header-actions { display: flex; gap: 12px; }
        .content-area { padding: 40px; animation: fadeIn 0.4s; max-width: 1800px; margin: 0 auto; width: 100%; }

        /* Stats Grid - TWO ROWS */
        .stats-grid-row { display: grid; gap: 24px; margin-bottom: 24px; }
        .stats-grid-row.row-2 { grid-template-columns: repeat(2, 1fr); }
        .stats-grid-row.row-4 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        @media (min-width: 1400px) {
          .stats-grid-row.row-4 { grid-template-columns: repeat(4, 1fr); }
        }

        .charts-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 40px; margin-top: 40px; }
        @media (min-width: 1200px) { .charts-grid { grid-template-columns: 2fr 1fr; } }
        .chart-card { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 16px; padding: 32px; }
        .chart-header { margin-bottom: 28px; }
        .chart-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
        .chart-subtitle { font-size: 14px; color: var(--text-tertiary); }
        .table-card { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 16px; padding: 32px; }
        .table-filters { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .search-box { flex: 1; min-width: 280px; position: relative; }
        .search-box input {
          width: 100%;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 14px 16px 14px 48px;
          color: var(--text-primary);
          font-family: 'Ubuntu', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          font-weight: 500;
        }
        .search-box input::placeholder { color: var(--text-tertiary); }
        .search-box input:focus {
          outline: none;
          background: var(--bg-primary);
          border-color: var(--mjolnir-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }
        .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); }
        .filter-select {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 14px 20px;
          color: var(--text-primary);
          font-family: 'Ubuntu', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 700;
        }
        .filter-select:focus {
          outline: none;
          background: var(--bg-primary);
          border-color: var(--mjolnir-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }
        .data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .data-table thead tr { border-bottom: 2px solid var(--border-color); }
        .data-table th {
          text-align: left;
          padding: 16px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .data-table td {
          padding: 20px 16px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 14px;
        }
        .data-table tbody tr { transition: all 0.2s; }
        .data-table tbody tr:hover { background: var(--bg-secondary); }
        .client-name { font-weight: 700; color: var(--text-primary); }
        .amount { font-family: 'Ubuntu Mono', monospace; font-weight: 700; font-size: 15px; color: var(--text-primary); }
        .invoice-id { font-family: 'Ubuntu Mono', monospace; color: var(--text-tertiary); font-size: 13px; }

        @media (max-width: 768px) {
          .logo-text { font-size: 18px; }
          .user-info { display: none; }
          .stats-grid-row { grid-template-columns: 1fr !important; }
        }

        .profile-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .profile-grid { grid-template-columns: 350px 1fr; } }
        .profile-card { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 16px; padding: 32px; }
        .profile-avatar-section { text-align: center; margin-bottom: 32px; }
        .profile-avatar-large {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
          color: white;
        }
        .profile-name { font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .profile-email { font-size: 14px; color: var(--text-tertiary); }
        .info-row { display: flex; align-items: center; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--border-color); }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 13px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; min-width: 100px; }
        .info-value { font-size: 14px; color: var(--text-primary); font-weight: 500; }
      `}</style>

      {/* Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-left">
          <div className="logo-container" onClick={() => setActiveView('overview')}>
            <div className="logo-icon">
              <Hammer size={24} color="white" />
            </div>
            <span className="logo-text">Mjolnir</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button className={`nav-icon-btn ${!darkMode ? 'active' : ''}`} onClick={() => setTheme(darkMode ? 'light' : 'dark')}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="nav-icon-btn" onClick={() => setActiveView('overview')} aria-label="Go to overview">
            <Home size={20} />
          </button>
          <button className="nav-icon-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-badge">{workshopSignups.filter(w => w.status === 'pending').length}</span>
          </button>
          <button className="nav-icon-btn" aria-label="Help">
            <HelpCircle size={20} />
          </button>
          <div className="user-menu-container">
            <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">{userData.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="user-info">
                <div className="user-name">{userData.name}</div>
                <div className="user-role">{userData.role}</div>
              </div>
            </button>
            <div className={`user-dropdown ${showUserMenu ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={() => { setActiveView('profile'); setShowUserMenu(false); }}>
                <User size={18} />My Profile
              </div>
              <div className="dropdown-item"><Settings size={18} />Settings</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item danger" onClick={() => supabaseClient.auth.signOut()}>
                <LogOut size={18} />Sign Out
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-layout">
        {/* Aceternity Premium Sidebar */}
        <motion.div
          className="aceternity-sidebar"
          initial={{ width: 280 }}
          animate={{ width: sidebarOpen ? 280 : 72 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <div className="sidebar-content">
            {sidebarLinks.map((link, idx) => (
              <div
                key={idx}
                className={`sidebar-link ${activeView === link.view ? 'active' : ''}`}
                onClick={() => setActiveView(link.view)}
              >
                <div className="sidebar-link-icon">
                  <link.icon size={20} />
                </div>
                <motion.span
                  className="sidebar-link-text"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: sidebarOpen ? 1 : 0,
                    display: sidebarOpen ? 'inline-block' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="main-content">
          <div className="content-header">
            <div>
              <h1 className="page-title">
                {activeView === 'overview' && 'Business Command Center'}
                {activeView === 'analytics' && 'Revenue Analytics'}
                {activeView === 'payments' && 'Payment Transactions'}
                {activeView === 'contracts' && 'Client Contracts'}
                {activeView === 'clients' && 'Client Management'}
                {activeView === 'workshops' && 'Workshop Signups'}
                {activeView === 'profile' && 'My Profile'}
              </h1>
              <p className="page-subtitle">
                {activeView === 'overview' && 'Mjolnir Design Studios - Complete business operations dashboard'}
                {activeView === 'analytics' && 'Deep dive into revenue trends and forecasts'}
                {activeView === 'payments' && 'Track all incoming and outgoing payments'}
                {activeView === 'contracts' && 'Manage active and upcoming contracts'}
                {activeView === 'clients' && 'View and manage your client relationships'}
                {activeView === 'workshops' && 'Monitor workshop registrations and attendance'}
                {activeView === 'profile' && 'Manage your account settings'}
              </p>
            </div>
            {activeView !== 'profile' && (
              <div className="header-actions">
                <button className="mjolnir-button" onClick={loadDashboardData} disabled={dataLoading}>
                  <RefreshCw size={18} className={dataLoading ? 'animate-spin' : ''} />Refresh
                </button>
                <button className="mjolnir-button"><Download size={18} />Export</button>
                {activeView === 'payments' && <button className="mjolnir-button-primary"><Plus size={18} />New Payment</button>}
              </div>
            )}
          </div>

          <div className="content-area">
            {activeView === 'overview' && (
              <>
                {/* FIRST ROW - 2 Boxes */}
                <div className="stats-grid-row row-2 slide-up" style={{ animationDelay: '0.1s' }}>
                  <StatCard
                    icon={FileText}
                    label="Active Contracts"
                    value={activeContracts.toString()}
                    subtitle={`${expiringContracts} expiring soon`}
                    trend={8.0}
                    iconColor="icon-blue"
                    onClick={() => setActiveView('contracts')}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Total Contract Value"
                    value={`$${(totalContractValue / 1000).toFixed(0)}k`}
                    subtitle="Annual recurring"
                    trend={0}
                    iconColor="icon-green"
                    onClick={() => setActiveView('contracts')}
                  />
                </div>

                {/* SECOND ROW - 4 Boxes with $Value/Count */}
                <div className="stats-grid-row row-4 slide-up" style={{ animationDelay: '0.2s' }}>
                  <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={`$${(totalRevenue / 1000).toFixed(1)}k`}
                    subtitle="This month"
                    trend={12.5}
                    iconColor="icon-blue"
                    onClick={() => setActiveView('payments')}
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Successful Payments"
                    value={`$${(totalRevenue / 1000).toFixed(1)}k / ${successfulCount}`}
                    subtitle={`${successfulCount} payments completed`}
                    trend={15.3}
                    iconColor="icon-green"
                    onClick={() => { setActiveView('payments'); setFilterStatus('paid'); }}
                  />
                  <StatCard
                    icon={Clock}
                    label="Pending Payments"
                    value={`$${(pendingAmount / 1000).toFixed(1)}k / ${pendingCount}`}
                    subtitle={`${pendingCount} awaiting payment`}
                    trend={-3.2}
                    iconColor="icon-yellow"
                    onClick={() => { setActiveView('payments'); setFilterStatus('pending'); }}
                  />
                  <StatCard
                    icon={XCircle}
                    label="Failed Payments"
                    value={`$${(failedAmount / 1000).toFixed(1)}k / ${failedCount}`}
                    subtitle={`${failedCount} need attention`}
                    trend={-8.1}
                    iconColor="icon-red"
                    onClick={() => { setActiveView('payments'); setFilterStatus('failed'); }}
                  />
                </div>

                <div className="charts-grid">
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Revenue & Expenses</div>
                      <div className="chart-subtitle">Monthly performance comparison</div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={monthlyRevenue}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={statusColors.paid} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={statusColors.paid} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(229, 231, 235, 0.1)' : 'rgba(0,0,0,0.05)'} />
                        <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} style={{ fontFamily: 'Ubuntu', fontWeight: 500 }} />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} style={{ fontFamily: 'Ubuntu', fontWeight: 500 }} />
                        <Tooltip contentStyle={{ background: darkMode ? '#2d3139' : '#ffffff', border: `2px solid ${darkMode ? '#9ca3af' : '#e5e7eb'}`, borderRadius: '12px', color: darkMode ? '#ffffff' : '#111827', fontFamily: 'Ubuntu', fontWeight: 500 }} />
                        <Legend wrapperStyle={{ fontFamily: 'Ubuntu', fontWeight: 700 }} />
                        <Area type="monotone" dataKey="revenue" stroke={statusColors.paid} strokeWidth={3} fill="url(#revenueGradient)" />
                        <Area type="monotone" dataKey="expenses" stroke={statusColors.failed} strokeWidth={3} fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Payment Status</div>
                      <div className="chart-subtitle">Current distribution</div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="value">
                          {paymentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: darkMode ? '#2d3139' : '#ffffff', border: `2px solid ${darkMode ? '#9ca3af' : '#e5e7eb'}`, borderRadius: '12px', color: darkMode ? '#ffffff' : '#111827', fontFamily: 'Ubuntu', fontWeight: 500 }} />
                        <Legend wrapperStyle={{ fontFamily: 'Ubuntu', fontWeight: 700 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="table-card">
                  <div className="chart-header">
                    <div className="chart-title">Recent Transactions</div>
                    <div className="chart-subtitle">Latest payment activity</div>
                  </div>
                  <div className="table-filters">
                    <div className="search-box">
                      <Search size={18} />
                      <input type="text" placeholder="Search by client or invoice..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by payment status">
                      <option value="all">All Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Client</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.slice(0, 8).map((payment) => (
                        <tr key={payment.id} onClick={() => setActiveView('payments')} style={{ cursor: 'pointer' }}>
                          <td className="invoice-id">{payment.invoiceId}</td>
                          <td className="client-name">{payment.client}</td>
                          <td>{payment.description}</td>
                          <td className="amount">${payment.amount.toLocaleString()}</td>
                          <td>{new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td><StatusBadge status={payment.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeView === 'workshops' && (
              <div className="table-card">
                <div className="chart-header">
                  <div className="chart-title">Workshop Signups</div>
                  <div className="chart-subtitle">Monitor workshop registrations from Calendly and HubSpot</div>
                </div>
                <div className="table-filters">
                  <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by workshop status">
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Scheduled Date</th>
                      <th>Amount</th>
                      <th>Source</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshopSignups.filter(signup => {
                      const matchesSearch = signup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           signup.email.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesFilter = filterStatus === 'all' || signup.status === filterStatus;
                      return matchesSearch && matchesFilter;
                    }).map((signup) => (
                      <tr key={signup.id}>
                        <td className="client-name">{signup.name}</td>
                        <td>{signup.email}</td>
                        <td>{signup.workshopType}</td>
                        <td>{new Date(signup.scheduledDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td className="amount">${signup.amount}</td>
                        <td>{signup.source}</td>
                        <td><StatusBadge status={signup.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeView === 'profile' && (
              <div className="profile-grid">
                <div className="profile-card">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar-large">{userData.name.split(' ').map(n => n[0]).join('')}</div>
                    <div className="profile-name">{userData.name}</div>
                    <div className="profile-email">{userData.email}</div>
                  </div>
                  <button className="mjolnir-button-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Edit size={18} />Edit Profile
                  </button>
                </div>
                <div className="profile-card">
                  <div className="chart-title" style={{ marginBottom: '24px' }}>Account Information</div>
                  <div className="info-row">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">{userData.name}</div>
                  </div>
                  <div className="info-row">
                    <Mail size={18} color="var(--text-tertiary)" />
                    <div className="info-label">Email</div>
                    <div className="info-value">{userData.email}</div>
                  </div>
                  <div className="info-row">
                    <Briefcase size={18} color="var(--text-tertiary)" />
                    <div className="info-label">Company</div>
                    <div className="info-value">{userData.company}</div>
                  </div>
                  <div className="info-row">
                    <User size={18} color="var(--text-tertiary)" />
                    <div className="info-label">Role</div>
                    <div className="info-value">{userData.role}</div>
                  </div>
                </div>
              </div>
            )}

            {(activeView === 'payments' || activeView === 'contracts' || activeView === 'clients' || activeView === 'analytics') && (
              <div className="table-card">
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>ðŸš€</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Integration Ready
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {activeView === 'payments' && `Showing ${filterStatus === 'all' ? 'all' : filterStatus} payment transactions with Stripe integration`}
                    {activeView === 'contracts' && 'Contract management with renewal tracking'}
                    {activeView === 'clients' && 'Client CRM with HubSpot integration'}
                    {activeView === 'analytics' && 'Advanced analytics and reporting dashboard'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  // Update userData when user is available
  if (user && userData.email === '') {
    setUserData({
      name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin User',
      email: user?.email || '',
      company: 'Mjolnir Design Studios',
      role: user?.user_metadata?.role || 'Administrator'
    });
  }

  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <style>{`
        .dashboard-container { transition: background-color 0.3s ease; }

        /* Top Navbar - FIXED */
        .top-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: var(--bg-elevated);
          border-bottom: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 100;
          box-shadow: 0 2px 8px var(--shadow);
        }
        .navbar-left { display: flex; align-items: center; gap: 32px; }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }
        .logo-container { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .logo-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          transition: transform 0.2s;
        }
        .logo-icon:hover { transform: scale(1.05); }
        .logo-text {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .nav-icon-btn {
          width: 40px;
          height: 40px;
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
          position: relative;
        }
        .nav-icon-btn:hover {
          background: var(--bg-secondary);
          border-color: var(--mjolnir-gold);
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .nav-icon-btn.active {
          background: var(--mjolnir-gold);
          border-color: var(--mjolnir-gold);
          color: white;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-elevated);
        }

        .user-menu-container { position: relative; }
        .user-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-button:hover {
          background: var(--bg-secondary);
          border-color: var(--mjolnir-gold);
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }
        .user-info { text-align: left; }
        .user-name { font-size: 14px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
        .user-role { font-size: 12px; color: var(--text-tertiary); line-height: 1.2; }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: var(--bg-elevated);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 8px 32px var(--shadow);
          padding: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s;
          z-index: 1000;
        }
        .user-dropdown.show { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background: rgba(212, 175, 55, 0.1);
          color: var(--mjolnir-gold);
        }
        .dropdown-divider { height: 2px; background: var(--border-color); margin: 8px 0; }
        .dropdown-item.danger { color: #ef4444; }
        .dropdown-item.danger:hover { background: rgba(239, 68, 68, 0.1); }

        /* Main Layout */
        .main-layout { display: flex; margin-top: 72px; min-height: calc(100vh - 72px); }

        /* Premium Aceternity Sidebar */
        .aceternity-sidebar {
          position: relative;
          height: calc(100vh - 72px);
          background: var(--bg-secondary);
          border-right: 2px solid var(--border-color);
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          gap: 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          cursor: pointer;
          position: relative;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 4px solid transparent;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar-link:hover {
          background: rgba(212, 175, 55, 0.1);
          color: var(--mjolnir-gold);
          border-left-color: var(--mjolnir-gold);
          padding-left: 24px;
        }

        .sidebar-link.active {
          background: rgba(212, 175, 55, 0.15);
          color: var(--mjolnir-gold);
          border-left-color: var(--mjolnir-gold);
          font-weight: 700;
        }

        .sidebar-link-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-link-text {
          margin-left: 14px;
        }

        .main-content { flex: 1; overflow-y: auto; background: var(--bg-primary); }
        .content-header {
          background: var(--bg-elevated);
          border-bottom: 2px solid var(--border-color);
          padding: 28px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .page-title { font-size: 32px; font-weight: 700; color: var(--text-primary); }
        .page-subtitle { font-size: 15px; color: var(--text-tertiary); margin-top: 4px; font-weight: 400; }
        .header-actions { display: flex; gap: 12px; }
        .content-area { padding: 40px; animation: fadeIn 0.4s; max-width: 1800px; margin: 0 auto; width: 100%; }

        /* Stats Grid - TWO ROWS */
        .stats-grid-row { display: grid; gap: 24px; margin-bottom: 24px; }
        .stats-grid-row.row-2 { grid-template-columns: repeat(2, 1fr); }
        .stats-grid-row.row-4 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        @media (min-width: 1400px) {
          .stats-grid-row.row-4 { grid-template-columns: repeat(4, 1fr); }
        }

        .charts-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 40px; margin-top: 40px; }
        @media (min-width: 1200px) { .charts-grid { grid-template-columns: 2fr 1fr; } }
        .chart-card { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 16px; padding: 32px; }
        .chart-header { margin-bottom: 28px; }
        .chart-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
        .chart-subtitle { font-size: 14px; color: var(--text-tertiary); }
        .table-card { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 16px; padding: 32px; }
        .table-filters { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .search-box { flex: 1; min-width: 280px; position: relative; }
        .search-box input {
          width: 100%;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 14px 16px 14px 48px;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          font-weight: 500;
        }
        .search-box input::placeholder { color: var(--text-tertiary); }
        .search-box input:focus {
          outline: none;
          background: var(--bg-primary);
          border-color: var(--mjolnir-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }
        .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); }
        .filter-select {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 14px 20px;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 700;
        }
        .filter-select:focus {
          outline: none;
          background: var(--bg-primary);
          border-color: var(--mjolnir-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }
        .data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .data-table thead tr { border-bottom: 2px solid var(--border-color); }
        .data-table th {
          text-align: left;
          padding: 16px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .data-table td {
          padding: 20px 16px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 14px;
        }
        .data-table tbody tr { transition: all 0.2s; }
        .data-table tbody tr:hover { background: var(--bg-secondary); }
        .client-name { font-weight: 700; color: var(--text-primary); }
        .amount { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 15px; color: var(--text-primary); }
        .invoice-id { font-family: 'JetBrains Mono', monospace; color: var(--text-tertiary); font-size: 13px; }

        @media (max-width: 768px) {
          .logo-text { font-size: 18px; }
          .user-info { display: none; }
          .stats-grid-row { grid-template-columns: 1fr !important; }
        }

        .profile-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .profile-grid { grid-template-columns: 350px 1fr; } }
        .profile-card { background: var(--bg-elevated); border: 2px solid var(--border-color); border-radius: 16px; padding: 32px; }
        .profile-avatar-section { text-align: center; margin-bottom: 32px; }
        .profile-avatar-large {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, var(--mjolnir-gold) 0%, var(--mjolnir-gold-hover) 100%);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
          color: white;
        }
        .profile-name { font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .profile-email { font-size: 14px; color: var(--text-tertiary); }
        .info-row { display: flex; align-items: center; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--border-color); }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 13px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; min-width: 100px; }
        .info-value { font-size: 14px; color: var(--text-primary); font-weight: 500; }

        /* Mjolnir UI Classes */
        .mjolnir-card {
          background: var(--bg-elevated);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .mjolnir-card:hover {
          border-color: var(--mjolnir-gold);
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
        }
        .mjolnir-button {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 12px 20px;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .mjolnir-button:hover {
          background: var(--mjolnir-gold);
          border-color: var(--mjolnir-gold);
          color: white;
          transform: translateY(-1px);
        }
        .mjolnir-button-primary {
          background: var(--mjolnir-gold);
          border-color: var(--mjolnir-gold);
          color: white;
        }
        .mjolnir-button-primary:hover {
          background: var(--mjolnir-gold-hover);
          border-color: var(--mjolnir-gold-hover);
        }

        .icon-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .icon-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-yellow { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .icon-red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-left">
          <div className="logo-container" onClick={() => setActiveView('overview')}>
            <div className="logo-icon">
              <Hammer size={24} color="white" />
            </div>
            <span className="logo-text">Mjolnir</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button className={`nav-icon-btn ${!darkMode ? 'active' : ''}`} onClick={() => setTheme(darkMode ? 'light' : 'dark')} title="Toggle theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="nav-icon-btn" onClick={() => setActiveView('overview')} title="Home">
            <Home size={20} />
          </button>
          <button className="nav-icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <button className="nav-icon-btn" title="Help">
            <HelpCircle size={20} />
          </button>
          <div className="user-menu-container">
            <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">{userData.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="user-info">
                <div className="user-name">{userData.name}</div>
                <div className="user-role">{userData.role}</div>
              </div>
            </button>
            <div className={`user-dropdown ${showUserMenu ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={() => { setActiveView('profile'); setShowUserMenu(false); }}>
                <User size={18} />My Profile
              </div>
              <div className="dropdown-item"><Settings size={18} />Settings</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item danger"><LogOut size={18} />Sign Out</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-layout">
        {/* Aceternity Premium Sidebar with Hover Animation */}
        <motion.div
          className="aceternity-sidebar"
          initial={{ width: 280 }}
          animate={{ width: sidebarOpen ? 280 : 72 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <div className="sidebar-content">
            {sidebarLinks.map((link, idx) => (
              <div
                key={idx}
                className={`sidebar-link ${activeView === link.view ? 'active' : ''}`}
                onClick={() => setActiveView(link.view)}
              >
                <div className="sidebar-link-icon">
                  <link.icon size={20} />
                </div>
                <motion.span
                  className="sidebar-link-text"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: sidebarOpen ? 1 : 0,
                    display: sidebarOpen ? 'inline-block' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="main-content">
          <div className="content-header">
            <div>
              <h1 className="page-title">
                {activeView === 'overview' && 'Business Command Center'}
                {activeView === 'analytics' && 'Revenue Analytics'}
                {activeView === 'payments' && 'Payment Transactions'}
                {activeView === 'contracts' && 'Client Contracts'}
                {activeView === 'workshops' && 'Workshop Signups'}
                {activeView === 'clients' && 'Client Management'}
                {activeView === 'profile' && 'My Profile'}
              </h1>
              <p className="page-subtitle">
                {activeView === 'overview' && 'Mjolnir Design Studios - Complete business operations dashboard'}
                {activeView === 'analytics' && 'Deep dive into revenue trends and forecasts'}
                {activeView === 'payments' && 'Track all incoming and outgoing payments'}
                {activeView === 'contracts' && 'Manage active and upcoming contracts'}
                {activeView === 'workshops' && 'Monitor workshop registrations and attendance'}
                {activeView === 'clients' && 'View and manage your client relationships'}
                {activeView === 'profile' && 'Manage your account settings'}
              </p>
            </div>
            {activeView !== 'profile' && (
              <div className="header-actions">
                <button className="mjolnir-button"><RefreshCw size={18} />Refresh</button>
                <button className="mjolnir-button"><Download size={18} />Export</button>
                {activeView === 'payments' && <button className="mjolnir-button-primary"><Plus size={18} />New Payment</button>}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
