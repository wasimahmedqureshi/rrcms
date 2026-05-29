import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Office, Section, Notification, PendingCase, DisposedCase } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'rrcms-auth',
    }
  )
);

// Office Store
interface OfficeState {
  offices: Office[];
  selectedOffice: Office | null;
  setOffices: (offices: Office[]) => void;
  addOffice: (office: Office) => void;
  updateOffice: (id: string, office: Partial<Office>) => void;
  removeOffice: (id: string) => void;
  setSelectedOffice: (office: Office | null) => void;
}

export const useOfficeStore = create<OfficeState>((set) => ({
  offices: [],
  selectedOffice: null,
  setOffices: (offices) => set({ offices }),
  addOffice: (office) => set((state) => ({ offices: [...state.offices, office] })),
  updateOffice: (id, updatedOffice) =>
    set((state) => ({
      offices: state.offices.map((o) => (o.id === id ? { ...o, ...updatedOffice } : o)),
    })),
  removeOffice: (id) => set((state) => ({ offices: state.offices.filter((o) => o.id !== id) })),
  setSelectedOffice: (office) => set({ selectedOffice: office }),
}));

// Section Store
interface SectionState {
  sections: Section[];
  selectedSection: Section | null;
  setSections: (sections: Section[]) => void;
  addSection: (section: Section) => void;
  updateSection: (id: string, section: Partial<Section>) => void;
  removeSection: (id: string) => void;
  setSelectedSection: (section: Section | null) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  sections: [],
  selectedSection: null,
  setSections: (sections) => set({ sections }),
  addSection: (section) => set((state) => ({ sections: [...state.sections, section] })),
  updateSection: (id, updatedSection) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === id ? { ...s, ...updatedSection } : s)),
    })),
  removeSection: (id) => set((state) => ({ sections: state.sections.filter((s) => s.id !== id) })),
  setSelectedSection: (section) => set({ selectedSection: section }),
}));

// Pending Cases Store
interface PendingCasesState {
  cases: PendingCase[];
  selectedCase: PendingCase | null;
  filters: {
    search: string;
    officeId: string;
    sectionId: string;
    dateFrom: string;
    dateTo: string;
    year: string;
  };
  setCases: (cases: PendingCase[]) => void;
  addCase: (caseData: PendingCase) => void;
  updateCase: (id: string, caseData: Partial<PendingCase>) => void;
  removeCase: (id: string) => void;
  setSelectedCase: (caseData: PendingCase | null) => void;
  setFilters: (filters: Partial<PendingCasesState['filters']>) => void;
  resetFilters: () => void;
}

export const usePendingCasesStore = create<PendingCasesState>((set) => ({
  cases: [],
  selectedCase: null,
  filters: {
    search: '',
    officeId: '',
    sectionId: '',
    dateFrom: '',
    dateTo: '',
    year: '',
  },
  setCases: (cases) => set({ cases }),
  addCase: (caseData) => set((state) => ({ cases: [caseData, ...state.cases] })),
  updateCase: (id, caseData) =>
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)),
    })),
  removeCase: (id) => set((state) => ({ cases: state.cases.filter((c) => c.id !== id) })),
  setSelectedCase: (caseData) => set({ selectedCase: caseData }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () =>
    set({
      filters: {
        search: '',
        officeId: '',
        sectionId: '',
        dateFrom: '',
        dateTo: '',
        year: '',
      },
    }),
}));

// Disposed Cases Store
interface DisposedCasesState {
  cases: DisposedCase[];
  selectedCase: DisposedCase | null;
  filters: {
    search: string;
    officeId: string;
    sectionId: string;
    dateFrom: string;
    dateTo: string;
    year: string;
  };
  setCases: (cases: DisposedCase[]) => void;
  addCase: (caseData: DisposedCase) => void;
  updateCase: (id: string, caseData: Partial<DisposedCase>) => void;
  removeCase: (id: string) => void;
  setSelectedCase: (caseData: DisposedCase | null) => void;
  setFilters: (filters: Partial<DisposedCasesState['filters']>) => void;
  resetFilters: () => void;
}

export const useDisposedCasesStore = create<DisposedCasesState>((set) => ({
  cases: [],
  selectedCase: null,
  filters: {
    search: '',
    officeId: '',
    sectionId: '',
    dateFrom: '',
    dateTo: '',
    year: '',
  },
  setCases: (cases) => set({ cases }),
  addCase: (caseData) => set((state) => ({ cases: [caseData, ...state.cases] })),
  updateCase: (id, caseData) =>
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)),
    })),
  removeCase: (id) => set((state) => ({ cases: state.cases.filter((c) => c.id !== id) })),
  setSelectedCase: (caseData) => set({ selectedCase: caseData }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () =>
    set({
      filters: {
        search: '',
        officeId: '',
        sectionId: '',
        dateFrom: '',
        dateTo: '',
        year: '',
      },
    }),
}));

// Notification Store
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
        ? state.unreadCount - 1
        : state.unreadCount,
    })),
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  currentView: 'dashboard' | 'pending' | 'disposed' | 'offices' | 'sections' | 'reports' | 'import' | 'settings';
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: UIState['currentView']) => void;
  setTheme: (theme: UIState['theme']) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      currentView: 'dashboard',
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'rrcms-ui',
    }
  )
);
