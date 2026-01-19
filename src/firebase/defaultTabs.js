import { Package, LayoutDashboard, Landmark, Phone, UserRound, ShoppingBag, PieChart, Mail, Settings, HelpCircle, ListTodo, ShoppingCart, Receipt } from 'lucide-react';

export const INITIAL_TABS = [
    { id: 'lagerverwaltung', title: 'Lagerverwaltung', url: '/lagerverwaltung', pinned: true },
    { id: 'dashboard', title: 'Dashboard', url: '/dashboard', pinned: false },
    { id: 'banking', title: 'Banking', url: '/banking', pinned: false },
    { id: 'telefonie', title: 'Telefonie', url: '/telefonie', pinned: false },
    { id: 'accounting', title: 'Accounting', url: '/accounting', pinned: false },
    { id: 'verkauf', title: 'Verkauf', url: '/verkauf', pinned: false },
    { id: 'statistik', title: 'Statistik', url: '/statistik', pinned: false },
    { id: 'post-office', title: 'Post Office', url: '/post-office', pinned: false },
    { id: 'administration', title: 'Administration', url: '/administration', pinned: false },
    { id: 'help', title: 'Help', url: '/help', pinned: false },
    { id: 'warenbestand', title: 'Warenbestand', url: '/warenbestand', pinned: false },
    { id: 'auswahllisten', title: 'Auswahllisten', url: '/auswahllisten', pinned: false },
    { id: 'einkauf', title: 'Einkauf', url: '/einkauf', pinned: false },
    { id: 'rechn', title: 'Rechn', url: '/rechn', pinned: false },
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
