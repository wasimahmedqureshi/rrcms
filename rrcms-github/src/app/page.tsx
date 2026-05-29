'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, FileText, Scale, Calendar, TrendingUp, AlertCircle,
  Plus, Search, Filter, Download, Upload, Trash2, Edit, Eye, ChevronDown,
  LogOut, Settings, Bell, Menu, X, BarChart3, PieChart, Activity,
  CheckCircle2, Clock, FileCheck, FileX, RefreshCw, Moon, Sun, Home,
  FolderOpen, Building, Layers, ClipboardList, ArrowRightLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'office_admin' | 'data_entry';
  office?: Office;
}

interface Office {
  id: string;
  officeName: string;
  officeCode?: string;
}

interface Section {
  id: string;
  sectionName: string;
  sectionCode?: string;
}

interface PendingCase {
  id: string;
  caseNo: string;
  sectionId: string;
  institutionDate: Date | string;
  purpose: string;
  appellant: string;
  respondent: string;
  hearingDate?: Date | string;
  officeId: string;
  status: string;
  remarks?: string;
  createdAt: Date | string;
  section?: Section;
  office?: Office;
}

interface DisposedCase {
  id: string;
  caseNo: string;
  sectionId: string;
  institutionDate: Date | string;
  disposalDate: Date | string;
  purpose: string;
  appellant: string;
  respondent: string;
  officeId: string;
  disposalType?: string;
  disposalRemarks?: string;
  createdAt: Date | string;
  section?: Section;
  office?: Office;
}

interface DashboardStats {
  totalPending: number;
  totalDisposed: number;
  todayRegistrations: number;
  todayDisposals: number;
  pendingBySection: { section: string; count: number }[];
  pendingByYear: { year: number; count: number }[];
  monthlyTrend: { month: string; registrations: number; disposals: number }[];
}

// Initial demo data
const DEMO_OFFICES: Office[] = [
  { id: '1', officeName: 'ACEM Fast Track, Niwai', officeCode: 'ACEM-NIW' },
  { id: '2', officeName: 'SDO Office, Tonk', officeCode: 'SDO-TONK' },
  { id: '3', officeName: 'Revenue Board, Jaipur', officeCode: 'RB-JPR' },
  { id: '4', officeName: 'Tehsildar Office, Deoli', officeCode: 'TEH-DEL' },
];

const DEMO_SECTIONS: Section[] = [
  { id: '1', sectionName: 'Land Revenue', sectionCode: 'LR' },
  { id: '2', sectionName: 'Land Acquisition', sectionCode: 'LA' },
  { id: '3', sectionName: 'Mutation Cases', sectionCode: 'MC' },
  { id: '4', sectionName: 'Partition Cases', sectionCode: 'PC' },
  { id: '5', sectionName: 'Appeal Cases', sectionCode: 'AC' },
];

const DEMO_PENDING_CASES: PendingCase[] = [
  {
    id: '1',
    caseNo: 'RC/2024/0001',
    sectionId: '1',
    institutionDate: '2024-01-15',
    purpose: 'Land Revenue Dispute',
    appellant: 'Ramesh Kumar',
    respondent: 'State of Rajasthan',
    hearingDate: '2024-03-20',
    officeId: '1',
    status: 'pending',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    caseNo: 'RC/2024/0002',
    sectionId: '2',
    institutionDate: '2024-02-10',
    purpose: 'Compensation Dispute',
    appellant: 'Suresh Sharma',
    respondent: 'NHAI',
    hearingDate: '2024-04-15',
    officeId: '2',
    status: 'pending',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    caseNo: 'RC/2023/0145',
    sectionId: '3',
    institutionDate: '2023-06-20',
    purpose: 'Name Transfer Request',
    appellant: 'Mahesh Singh',
    respondent: 'Patwari Circle',
    hearingDate: '2024-02-28',
    officeId: '1',
    status: 'pending',
    createdAt: '2023-06-20',
  },
  {
    id: '4',
    caseNo: 'RC/2022/0089',
    sectionId: '4',
    institutionDate: '2022-03-15',
    purpose: 'Property Partition',
    appellant: 'Kamla Devi',
    respondent: 'Heirs of Ram Lal',
    officeId: '3',
    status: 'pending',
    createdAt: '2022-03-15',
  },
  {
    id: '5',
    caseNo: 'RC/2021/0234',
    sectionId: '5',
    institutionDate: '2021-08-10',
    purpose: 'Appeal Against Order',
    appellant: 'Gopal Joshi',
    respondent: 'Tehsildar Office',
    officeId: '4',
    status: 'pending',
    createdAt: '2021-08-10',
  },
];

const DEMO_DISPOSED_CASES: DisposedCase[] = [
  {
    id: '1',
    caseNo: 'RC/2023/0056',
    sectionId: '1',
    institutionDate: '2023-01-10',
    disposalDate: '2024-01-20',
    purpose: 'Land Revenue Dispute',
    appellant: 'Lakhan Singh',
    respondent: 'State of Rajasthan',
    officeId: '1',
    disposalType: 'Order Passed',
    createdAt: '2023-01-10',
  },
  {
    id: '2',
    caseNo: 'RC/2023/0078',
    sectionId: '2',
    institutionDate: '2023-03-15',
    disposalDate: '2024-02-28',
    purpose: 'Compensation Award',
    appellant: 'Vijay Kumar',
    respondent: 'PWD',
    officeId: '2',
    disposalType: 'Settled',
    createdAt: '2023-03-15',
  },
];

// Demo user
const DEMO_USER: User = {
  id: '1',
  email: 'admin@rrcms.gov.in',
  name: 'Admin User',
  role: 'super_admin',
};

// Utility functions
const calculateAging = (institutionDate: Date | string): { days: number; category: string } => {
  const date = new Date(institutionDate);
  const now = new Date();
  const days = differenceInDays(now, date);
  const months = differenceInMonths(now, date);
  const years = differenceInYears(now, date);

  let category = '';
  if (months <= 6) category = 'Upto 6 Months';
  else if (months <= 12) category = '6 Months to 1 Year';
  else if (years < 2) category = '1 to 2 Years';
  else if (years < 3) category = '2 to 3 Years';
  else if (years < 5) category = '3 to 5 Years';
  else if (years < 10) category = '5 to 10 Years';
  else if (years < 20) category = '10 to 20 Years';
  else if (years < 30) category = '20 to 30 Years';
  else if (years < 40) category = '30 to 40 Years';
  else category = 'More than 40 Years';

  return { days, category };
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

// Main App Component
export default function RRCMSApp() {
  const { toast } = useToast();
  
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Data state
  const [offices, setOffices] = useState<Office[]>(DEMO_OFFICES);
  const [sections, setSections] = useState<Section[]>(DEMO_SECTIONS);
  const [pendingCases, setPendingCases] = useState<PendingCase[]>(DEMO_PENDING_CASES);
  const [disposedCases, setDisposedCases] = useState<DisposedCase[]>(DEMO_DISPOSED_CASES);
  
  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [caseForm, setCaseForm] = useState({
    caseNo: '',
    sectionId: '',
    institutionDate: '',
    purpose: '',
    appellant: '',
    respondent: '',
    hearingDate: '',
    officeId: '',
    remarks: '',
  });
  const [disposeForm, setDisposeForm] = useState({
    caseId: '',
    disposalDate: '',
    disposalType: '',
    disposalRemarks: '',
  });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOffice, setFilterOffice] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterYear, setFilterYear] = useState('');
  
  // Dialog state
  const [newCaseDialogOpen, setNewCaseDialogOpen] = useState(false);
  const [disposeDialogOpen, setDisposeDialogOpen] = useState(false);
  const [viewCaseDialog, setViewCaseDialog] = useState<PendingCase | DisposedCase | null>(null);
  const [editingCase, setEditingCase] = useState<PendingCase | null>(null);

  // Computed stats
  const stats: DashboardStats = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Calculate year-wise pending cases
    const yearMap: Record<number, number> = {};
    pendingCases.forEach(c => {
      const year = new Date(c.institutionDate).getFullYear();
      yearMap[year] = (yearMap[year] || 0) + 1;
    });
    
    const pendingByYear = Object.entries(yearMap)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => b.year - a.year);
    
    return {
      totalPending: pendingCases.length,
      totalDisposed: disposedCases.length,
      todayRegistrations: pendingCases.filter(c => 
        format(new Date(c.createdAt), 'yyyy-MM-dd') === todayStr
      ).length,
      todayDisposals: disposedCases.filter(c => 
        format(new Date(c.disposalDate), 'yyyy-MM-dd') === todayStr
      ).length,
      pendingBySection: sections.map(s => ({
        section: s.sectionName,
        count: pendingCases.filter(c => c.sectionId === s.id).length,
      })).filter(s => s.count > 0),
      pendingByYear,
      monthlyTrend: [
        { month: 'Jan', registrations: 45, disposals: 32 },
        { month: 'Feb', registrations: 52, disposals: 28 },
        { month: 'Mar', registrations: 38, disposals: 41 },
        { month: 'Apr', registrations: 65, disposals: 35 },
        { month: 'May', registrations: 48, disposals: 52 },
        { month: 'Jun', registrations: 55, disposals: 45 },
      ],
    };
  }, [pendingCases, disposedCases, sections]);

  // Filtered cases
  const filteredPendingCases = useMemo(() => {
    return pendingCases.filter(c => {
      const matchesSearch = !searchTerm || 
        c.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.appellant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.respondent.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOffice = !filterOffice || c.officeId === filterOffice;
      const matchesSection = !filterSection || c.sectionId === filterSection;
      const matchesYear = !filterYear || 
        new Date(c.institutionDate).getFullYear().toString() === filterYear;
      
      return matchesSearch && matchesOffice && matchesSection && matchesYear;
    });
  }, [pendingCases, searchTerm, filterOffice, filterSection, filterYear]);

  // Handlers
  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      setUser(DEMO_USER);
      setIsAuthenticated(true);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${DEMO_USER.name}!`,
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  const handleAddCase = () => {
    if (!caseForm.caseNo || !caseForm.sectionId || !caseForm.institutionDate || !caseForm.officeId) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newCase: PendingCase = {
      id: Date.now().toString(),
      ...caseForm,
      institutionDate: caseForm.institutionDate,
      hearingDate: caseForm.hearingDate || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      section: sections.find(s => s.id === caseForm.sectionId),
      office: offices.find(o => o.id === caseForm.officeId),
    };

    setPendingCases([newCase, ...pendingCases]);
    setCaseForm({
      caseNo: '',
      sectionId: '',
      institutionDate: '',
      purpose: '',
      appellant: '',
      respondent: '',
      hearingDate: '',
      officeId: '',
      remarks: '',
    });
    setNewCaseDialogOpen(false);
    toast({
      title: 'Case Registered',
      description: `Case ${caseForm.caseNo} has been registered successfully.`,
    });
  };

  const handleDisposeCase = () => {
    if (!disposeForm.caseId || !disposeForm.disposalDate) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const caseToDispose = pendingCases.find(c => c.id === disposeForm.caseId);
    if (!caseToDispose) return;

    const disposedCase: DisposedCase = {
      ...caseToDispose,
      id: Date.now().toString(),
      disposalDate: disposeForm.disposalDate,
      disposalType: disposeForm.disposalType || undefined,
      disposalRemarks: disposeForm.disposalRemarks || undefined,
      createdAt: caseToDispose.createdAt,
      section: caseToDispose.section,
      office: caseToDispose.office,
    };

    setDisposedCases([disposedCase, ...disposedCases]);
    setPendingCases(pendingCases.filter(c => c.id !== disposeForm.caseId));
    setDisposeForm({ caseId: '', disposalDate: '', disposalType: '', disposalRemarks: '' });
    setDisposeDialogOpen(false);
    toast({
      title: 'Case Disposed',
      description: `Case ${caseToDispose.caseNo} has been marked as disposed.`,
    });
  };

  const handleDeleteCase = (caseId: string, type: 'pending' | 'disposed') => {
    if (type === 'pending') {
      setPendingCases(pendingCases.filter(c => c.id !== caseId));
    } else {
      setDisposedCases(disposedCases.filter(c => c.id !== caseId));
    }
    toast({
      title: 'Case Deleted',
      description: 'The case has been removed from the system.',
    });
  };

  // Calculate MPR data
  const pendingMPRData = useMemo(() => {
    return offices.map(office => {
      const officeCases = pendingCases.filter(c => c.officeId === office.id);
      const aging = {
        upto6Months: 0,
        sixTo12Months: 0,
        oneTo2Years: 0,
        twoTo3Years: 0,
        threeTo5Years: 0,
        fiveTo10Years: 0,
        tenTo20Years: 0,
        twentyTo30Years: 0,
        thirtyTo40Years: 0,
        moreThan40Years: 0,
      };

      officeCases.forEach(c => {
        const { category } = calculateAging(c.institutionDate);
        if (category === 'Upto 6 Months') aging.upto6Months++;
        else if (category === '6 Months to 1 Year') aging.sixTo12Months++;
        else if (category === '1 to 2 Years') aging.oneTo2Years++;
        else if (category === '2 to 3 Years') aging.twoTo3Years++;
        else if (category === '3 to 5 Years') aging.threeTo5Years++;
        else if (category === '5 to 10 Years') aging.fiveTo10Years++;
        else if (category === '10 to 20 Years') aging.tenTo20Years++;
        else if (category === '20 to 30 Years') aging.twentyTo30Years++;
        else if (category === '30 to 40 Years') aging.thirtyTo40Years++;
        else aging.moreThan40Years++;
      });

      return {
        officeName: office.officeName,
        total: officeCases.length,
        ...aging,
      };
    });
  }, [offices, pendingCases]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 p-4 ${darkMode ? 'dark' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full">
                  <Scale className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-orange-600 bg-clip-text text-transparent">
                RRCMS
              </CardTitle>
              <CardDescription className="text-gray-600">
                Rajasthan Revenue Court Management System
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  Sign In
                </Button>
                <div className="text-center text-sm text-gray-500">
                  Demo: Use any email and password
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main Application
  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark bg-gray-900' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">RRCMS</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rajasthan Revenue Court Management System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700
          transition-transform duration-300 lg:w-64 shrink-0
          pt-16 lg:pt-0
        `}>
          <ScrollArea className="h-full py-4">
            <nav className="px-3 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'pending', label: 'Pending Cases', icon: Clock },
                { id: 'disposed', label: 'Disposed Cases', icon: CheckCircle2 },
                { id: 'register', label: 'New Registration', icon: Plus },
                { id: 'offices', label: 'Offices', icon: Building },
                { id: 'sections', label: 'Sections', icon: Layers },
                { id: 'pending-mpr', label: 'Pending MPR', icon: FileText },
                { id: 'disposal-mpr', label: 'Disposal MPR', icon: ClipboardList },
                { id: 'import', label: 'Import Data', icon: Upload },
                { id: 'export', label: 'Export Data', icon: Download },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    currentView === item.id 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 lg:p-6">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                  <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setNewCaseDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Case
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPending}</p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Disposed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDisposed}</p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Today's Registrations</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayRegistrations}</p>
                      </div>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Today's Disposals</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayDisposals}</p>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <FileCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section-wise and Year-wise Pending Cases - Count Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section-wise Pending Cases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5 text-blue-600" />
                      Section-wise Pending Cases
                    </CardTitle>
                    <CardDescription>Breakdown of pending cases by section</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.pendingBySection.length > 0 ? (
                        stats.pendingBySection.map((item, index) => (
                          <div 
                            key={item.section} 
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium text-gray-900 dark:text-white">{item.section}</span>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className="text-lg font-bold px-4 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                            >
                              {item.count}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No pending cases</div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700 mt-4">
                        <span className="font-bold text-gray-900 dark:text-white">Total Pending</span>
                        <Badge 
                          className="text-lg font-bold px-4 py-1 bg-blue-600 text-white"
                        >
                          {stats.totalPending}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Year-wise Pending Cases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      Year-wise Pending Cases
                    </CardTitle>
                    <CardDescription>Breakdown of pending cases by institution year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.pendingByYear.length > 0 ? (
                        stats.pendingByYear.map((item, index) => (
                          <div 
                            key={item.year} 
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }}
                              />
                              <span className="font-medium text-gray-900 dark:text-white">{item.year}</span>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className="text-lg font-bold px-4 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                            >
                              {item.count}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No pending cases</div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg border-2 border-orange-200 dark:border-orange-700 mt-4">
                        <span className="font-bold text-gray-900 dark:text-white">Total Pending</span>
                        <Badge 
                          className="text-lg font-bold px-4 py-1 bg-orange-600 text-white"
                        >
                          {stats.totalPending}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Pending Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case No</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Appellant</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Aging</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingCases.slice(0, 5).map((c) => {
                          const aging = calculateAging(c.institutionDate);
                          return (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.caseNo}</TableCell>
                              <TableCell>{sections.find(s => s.id === c.sectionId)?.sectionName || '-'}</TableCell>
                              <TableCell>{c.appellant}</TableCell>
                              <TableCell className="max-w-xs truncate">{c.purpose}</TableCell>
                              <TableCell>
                                <Badge variant={aging.days > 365 ? 'destructive' : aging.days > 180 ? 'secondary' : 'default'}>
                                  {aging.days} days
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Pending
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Pending Cases View */}
          {currentView === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Cases</h2>
                <Button onClick={() => setNewCaseDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Case
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search cases..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Office</Label>
                      <Select value={filterOffice} onValueChange={setFilterOffice}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Offices" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Offices</SelectItem>
                          {offices.map(o => (
                            <SelectItem key={o.id} value={o.id}>{o.officeName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={filterSection} onValueChange={setFilterSection}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Sections" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Sections</SelectItem>
                          {sections.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.sectionName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Years</SelectItem>
                          {['2024', '2023', '2022', '2021', '2020'].map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cases Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case No</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Institution Date</TableHead>
                          <TableHead>Appellant</TableHead>
                          <TableHead>Respondent</TableHead>
                          <TableHead>Office</TableHead>
                          <TableHead>Aging</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPendingCases.map((c) => {
                          const aging = calculateAging(c.institutionDate);
                          return (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.caseNo}</TableCell>
                              <TableCell>{sections.find(s => s.id === c.sectionId)?.sectionName || '-'}</TableCell>
                              <TableCell>{format(new Date(c.institutionDate), 'dd/MM/yyyy')}</TableCell>
                              <TableCell>{c.appellant}</TableCell>
                              <TableCell>{c.respondent}</TableCell>
                              <TableCell className="max-w-[150px] truncate">
                                {offices.find(o => o.id === c.officeId)?.officeName || '-'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={aging.days > 365 ? 'destructive' : aging.days > 180 ? 'secondary' : 'default'}>
                                  {aging.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewCaseDialog(c)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setDisposeForm({ ...disposeForm, caseId: c.id });
                                      setDisposeDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Case?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete case {c.caseNo}? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteCase(c.id, 'pending')}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  {filteredPendingCases.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No pending cases found
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Disposed Cases View */}
          {currentView === 'disposed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Disposed Cases</h2>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {disposedCases.length} Total
                </Badge>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case No</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Institution Date</TableHead>
                          <TableHead>Disposal Date</TableHead>
                          <TableHead>Appellant</TableHead>
                          <TableHead>Office</TableHead>
                          <TableHead>Disposal Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {disposedCases.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.caseNo}</TableCell>
                            <TableCell>{sections.find(s => s.id === c.sectionId)?.sectionName || '-'}</TableCell>
                            <TableCell>{format(new Date(c.institutionDate), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{format(new Date(c.disposalDate), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{c.appellant}</TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {offices.find(o => o.id === c.officeId)?.officeName || '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {c.disposalType || 'Disposed'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setViewCaseDialog(c)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Case?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete disposed case {c.caseNo}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteCase(c.id, 'disposed')}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* New Registration View */}
          {currentView === 'register' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Case Registration</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Case Details</CardTitle>
                  <CardDescription>Enter the details for the new case registration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="caseNo">Case Number *</Label>
                      <Input
                        id="caseNo"
                        placeholder="e.g., RC/2024/0001"
                        value={caseForm.caseNo}
                        onChange={(e) => setCaseForm({ ...caseForm, caseNo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section *</Label>
                      <Select
                        value={caseForm.sectionId}
                        onValueChange={(v) => setCaseForm({ ...caseForm, sectionId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.sectionName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institutionDate">Institution Date *</Label>
                      <Input
                        id="institutionDate"
                        type="date"
                        value={caseForm.institutionDate}
                        onChange={(e) => setCaseForm({ ...caseForm, institutionDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office">Office *</Label>
                      <Select
                        value={caseForm.officeId}
                        onValueChange={(v) => setCaseForm({ ...caseForm, officeId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Office" />
                        </SelectTrigger>
                        <SelectContent>
                          {offices.map(o => (
                            <SelectItem key={o.id} value={o.id}>{o.officeName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Textarea
                        id="purpose"
                        placeholder="Enter case purpose"
                        value={caseForm.purpose}
                        onChange={(e) => setCaseForm({ ...caseForm, purpose: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appellant">Appellant</Label>
                      <Input
                        id="appellant"
                        placeholder="Appellant name"
                        value={caseForm.appellant}
                        onChange={(e) => setCaseForm({ ...caseForm, appellant: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respondent">Respondent</Label>
                      <Input
                        id="respondent"
                        placeholder="Respondent name"
                        value={caseForm.respondent}
                        onChange={(e) => setCaseForm({ ...caseForm, respondent: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hearingDate">Hearing Date</Label>
                      <Input
                        id="hearingDate"
                        type="date"
                        value={caseForm.hearingDate}
                        onChange={(e) => setCaseForm({ ...caseForm, hearingDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Input
                        id="remarks"
                        placeholder="Any remarks"
                        value={caseForm.remarks}
                        onChange={(e) => setCaseForm({ ...caseForm, remarks: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCaseForm({
                        caseNo: '',
                        sectionId: '',
                        institutionDate: '',
                        purpose: '',
                        appellant: '',
                        respondent: '',
                        hearingDate: '',
                        officeId: '',
                        remarks: '',
                      })}
                    >
                      Clear
                    </Button>
                    <Button onClick={handleAddCase} className="bg-blue-600 hover:bg-blue-700">
                      Register Case
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Offices Management */}
          {currentView === 'offices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Office Management</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Office
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Office</DialogTitle>
                      <DialogDescription>Add a new office to the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Office Name</Label>
                        <Input placeholder="Enter office name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Office Code</Label>
                        <Input placeholder="Enter office code" />
                      </div>
                      <div className="space-y-2">
                        <Label>District</Label>
                        <Input placeholder="Enter district" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Office</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offices.map(office => (
                  <Card key={office.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{office.officeName}</CardTitle>
                            <p className="text-sm text-gray-500">{office.officeCode}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Pending Cases:</span>
                        <Badge variant="secondary">
                          {pendingCases.filter(c => c.officeId === office.id).length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-500">Disposed Cases:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {disposedCases.filter(c => c.officeId === office.id).length}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sections Management */}
          {currentView === 'sections' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Section Management</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Section</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Section Name</Label>
                        <Input placeholder="Enter section name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Code</Label>
                        <Input placeholder="Enter section code" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Section</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map(section => (
                  <Card key={section.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Layers className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{section.sectionName}</CardTitle>
                            <p className="text-sm text-gray-500">{section.sectionCode}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total Cases:</span>
                        <Badge variant="secondary">
                          {pendingCases.filter(c => c.sectionId === section.id).length + 
                           disposedCases.filter(c => c.sectionId === section.id).length}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pending MPR Report */}
          {currentView === 'pending-mpr' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pending MPR Report</h2>
                  <p className="text-gray-500">Monthly Progress Report - Case Aging Analysis</p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                          <TableHead className="font-semibold">S.No.</TableHead>
                          <TableHead className="font-semibold">Office Name</TableHead>
                          <TableHead className="font-semibold text-center">Total Pending</TableHead>
                          <TableHead className="font-semibold text-center">Upto 6 Months</TableHead>
                          <TableHead className="font-semibold text-center">6 Mo - 1 Yr</TableHead>
                          <TableHead className="font-semibold text-center">1-2 Years</TableHead>
                          <TableHead className="font-semibold text-center">2-3 Years</TableHead>
                          <TableHead className="font-semibold text-center">3-5 Years</TableHead>
                          <TableHead className="font-semibold text-center">5-10 Years</TableHead>
                          <TableHead className="font-semibold text-center">10-20 Years</TableHead>
                          <TableHead className="font-semibold text-center">20-30 Years</TableHead>
                          <TableHead className="font-semibold text-center">30-40 Years</TableHead>
                          <TableHead className="font-semibold text-center">&gt;40 Years</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingMPRData.map((row, index) => (
                          <TableRow key={row.officeName}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{row.officeName}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-semibold">{row.total}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{row.upto6Months}</TableCell>
                            <TableCell className="text-center">{row.sixTo12Months}</TableCell>
                            <TableCell className="text-center">{row.oneTo2Years}</TableCell>
                            <TableCell className="text-center">{row.twoTo3Years}</TableCell>
                            <TableCell className="text-center">{row.threeTo5Years}</TableCell>
                            <TableCell className="text-center">{row.fiveTo10Years}</TableCell>
                            <TableCell className="text-center">{row.tenTo20Years}</TableCell>
                            <TableCell className="text-center">{row.twentyTo30Years}</TableCell>
                            <TableCell className="text-center">{row.thirtyTo40Years}</TableCell>
                            <TableCell className="text-center">{row.moreThan40Years}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Disposal MPR Report */}
          {currentView === 'disposal-mpr' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Disposal MPR Report</h2>
                  <p className="text-gray-500">Monthly Progress Report - Disposal Analysis</p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                          <TableHead className="font-semibold">S.No.</TableHead>
                          <TableHead className="font-semibold">Office Name</TableHead>
                          <TableHead className="font-semibold text-center">Total Disposal</TableHead>
                          <TableHead className="font-semibold text-center">Over 5 Years</TableHead>
                          <TableHead className="font-semibold text-center">Over 3 Years</TableHead>
                          <TableHead className="font-semibold text-center">Over 2 Years</TableHead>
                          <TableHead className="font-semibold text-center">Over 1 Year</TableHead>
                          <TableHead className="font-semibold text-center">Less Than 1 Year</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {offices.map((office, index) => {
                          const officeCases = disposedCases.filter(c => c.officeId === office.id);
                          let over5 = 0, over3 = 0, over2 = 0, over1 = 0, less1 = 0;
                          
                          officeCases.forEach(c => {
                            const days = differenceInDays(new Date(c.disposalDate), new Date(c.institutionDate));
                            const years = days / 365;
                            if (years > 5) over5++;
                            else if (years > 3) over3++;
                            else if (years > 2) over2++;
                            else if (years > 1) over1++;
                            else less1++;
                          });
                          
                          return (
                            <TableRow key={office.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-medium">{office.officeName}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
                                  {officeCases.length}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{over5}</TableCell>
                              <TableCell className="text-center">{over3}</TableCell>
                              <TableCell className="text-center">{over2}</TableCell>
                              <TableCell className="text-center">{over1}</TableCell>
                              <TableCell className="text-center">{less1}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Import Data */}
          {currentView === 'import' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Import Pending Cases</h3>
                    <p className="text-gray-500 text-center mb-4">
                      Upload Excel file with pending case data
                    </p>
                    <Button variant="outline">
                      Select File (.xlsx)
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                      <Upload className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Import Disposed Cases</h3>
                    <p className="text-gray-500 text-center mb-4">
                      Upload Excel file with disposed case data
                    </p>
                    <Button variant="outline">
                      Select File (.xlsx)
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Import Format Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Pending Cases Columns:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Case No</li>
                        <li>• Section</li>
                        <li>• Institution Date</li>
                        <li>• Purpose</li>
                        <li>• Appellant</li>
                        <li>• Respondent</li>
                        <li>• Hearing Date</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Disposed Cases Columns:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Case No</li>
                        <li>• Section</li>
                        <li>• Institution Date</li>
                        <li>• Disposal Date</li>
                        <li>• Purpose</li>
                        <li>• Appellant</li>
                        <li>• Respondent</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Export Data */}
          {currentView === 'export' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Export Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Pending Cases', desc: 'Export all pending case data', icon: Clock, color: 'blue' },
                  { title: 'Disposed Cases', desc: 'Export all disposed case data', icon: CheckCircle2, color: 'green' },
                  { title: 'Pending MPR', desc: 'Monthly Progress Report - Pending', icon: FileText, color: 'orange' },
                  { title: 'Disposal MPR', desc: 'Monthly Progress Report - Disposal', icon: ClipboardList, color: 'purple' },
                  { title: 'Section-wise Report', desc: 'Cases grouped by section', icon: Layers, color: 'pink' },
                  { title: 'Office-wise Report', desc: 'Cases grouped by office', icon: Building, color: 'cyan' },
                ].map((item, i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg`}>
                          <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Excel
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {currentView === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input defaultValue={user?.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue={user?.email} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input defaultValue={user?.role?.replace('_', ' ')} disabled />
                      </div>
                    </div>
                    <Button>Update Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Toggle dark mode theme</p>
                      </div>
                      <Button
                        variant={darkMode ? 'default' : 'outline'}
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        {darkMode ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                        {darkMode ? 'Dark' : 'Light'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* New Case Dialog */}
      <Dialog open={newCaseDialogOpen} onOpenChange={setNewCaseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Case</DialogTitle>
            <DialogDescription>Fill in the details to register a new case</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Case Number *</Label>
              <Input
                placeholder="e.g., RC/2024/0001"
                value={caseForm.caseNo}
                onChange={(e) => setCaseForm({ ...caseForm, caseNo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Section *</Label>
              <Select
                value={caseForm.sectionId}
                onValueChange={(v) => setCaseForm({ ...caseForm, sectionId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.sectionName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Institution Date *</Label>
              <Input
                type="date"
                value={caseForm.institutionDate}
                onChange={(e) => setCaseForm({ ...caseForm, institutionDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Office *</Label>
              <Select
                value={caseForm.officeId}
                onValueChange={(v) => setCaseForm({ ...caseForm, officeId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Office" />
                </SelectTrigger>
                <SelectContent>
                  {offices.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.officeName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Appellant</Label>
              <Input
                value={caseForm.appellant}
                onChange={(e) => setCaseForm({ ...caseForm, appellant: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Respondent</Label>
              <Input
                value={caseForm.respondent}
                onChange={(e) => setCaseForm({ ...caseForm, respondent: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Purpose</Label>
              <Textarea
                value={caseForm.purpose}
                onChange={(e) => setCaseForm({ ...caseForm, purpose: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hearing Date</Label>
              <Input
                type="date"
                value={caseForm.hearingDate}
                onChange={(e) => setCaseForm({ ...caseForm, hearingDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCaseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCase}>Register Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispose Case Dialog */}
      <Dialog open={disposeDialogOpen} onOpenChange={setDisposeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Case as Disposed</DialogTitle>
            <DialogDescription>Enter disposal details for this case</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Disposal Date *</Label>
              <Input
                type="date"
                value={disposeForm.disposalDate}
                onChange={(e) => setDisposeForm({ ...disposeForm, disposalDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Disposal Type</Label>
              <Select
                value={disposeForm.disposalType}
                onValueChange={(v) => setDisposeForm({ ...disposeForm, disposalType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Disposal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Order Passed</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                value={disposeForm.disposalRemarks}
                onChange={(e) => setDisposeForm({ ...disposeForm, disposalRemarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisposeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDisposeCase} className="bg-green-600 hover:bg-green-700">
              Mark as Disposed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Case Dialog */}
      <Dialog open={!!viewCaseDialog} onOpenChange={() => setViewCaseDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
          </DialogHeader>
          {viewCaseDialog && (
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Case No</p>
                  <p className="font-medium">{viewCaseDialog.caseNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Section</p>
                  <p className="font-medium">
                    {sections.find(s => s.id === viewCaseDialog.sectionId)?.sectionName || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Institution Date</p>
                  <p className="font-medium">
                    {format(new Date(viewCaseDialog.institutionDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Office</p>
                  <p className="font-medium">
                    {offices.find(o => o.id === viewCaseDialog.officeId)?.officeName || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appellant</p>
                  <p className="font-medium">{viewCaseDialog.appellant || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Respondent</p>
                  <p className="font-medium">{viewCaseDialog.respondent || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="font-medium">{viewCaseDialog.purpose || '-'}</p>
              </div>
              {'disposalDate' in viewCaseDialog && (
                <div>
                  <p className="text-sm text-gray-500">Disposal Date</p>
                  <p className="font-medium">
                    {format(new Date(viewCaseDialog.disposalDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
