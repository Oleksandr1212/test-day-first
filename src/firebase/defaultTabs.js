import { Package, LayoutDashboard, Landmark, Phone, UserRound, ShoppingBag, PieChart, Mail, Settings, HelpCircle, ListTodo, ShoppingCart, Receipt } from 'lucide-react';

export const INITIAL_TABS = [
    { id: 'lagerverwaltung', title: 'Lagerverwaltung', url: '/lagerverwaltung', icon: Package, pinned: true },
    { id: 'dashboard', title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, pinned: false },
    { id: 'banking', title: 'Banking', url: '/banking', icon: Landmark, pinned: false },
    { id: 'telefonie', title: 'Telefonie', url: '/telefonie', icon: Phone, pinned: false },
    { id: 'accounting', title: 'Accounting', url: '/accounting', icon: UserRound, pinned: false },
    { id: 'verkauf', title: 'Verkauf', url: '/verkauf', icon: ShoppingBag, pinned: false },
    { id: 'statistik', title: 'Statistik', url: '/statistik', icon: PieChart, pinned: false },
    { id: 'post-office', title: 'Post Office', url: '/post-office', icon: Mail, pinned: false },
    { id: 'administration', title: 'Administration', url: '/administration', icon: Settings, pinned: false },
    { id: 'help', title: 'Help', url: '/help', icon: HelpCircle, pinned: false },
    { id: 'warenbestand', title: 'Warenbestand', url: '/warenbestand', icon: Package, pinned: false },
    { id: 'auswahllisten', title: 'Auswahllisten', url: '/auswahllisten', icon: ListTodo, pinned: false },
    { id: 'einkauf', title: 'Einkauf', url: '/einkauf', icon: ShoppingCart, pinned: false },
    { id: 'rechn', title: 'Rechn', url: '/rechn', icon: Receipt, pinned: false },
];

export const ICON_MAP = {
    lagerverwaltung: Package,
    dashboard: LayoutDashboard,
    banking: Landmark,
    telefonie: Phone,
    accounting: UserRound,
    verkauf: ShoppingBag,
    statistik: PieChart,
    'post-office': Mail,
    administration: Settings,
    help: HelpCircle,
    warenbestand: Package,
    auswahllisten: ListTodo,
    einkauf: ShoppingCart,
    rechn: Receipt
};
