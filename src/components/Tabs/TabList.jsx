import React, { useState, useEffect, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TabItem } from './TabItem';
import { OverflowMenu } from './OverflowMenu';
import { ChevronDown, LayoutDashboard, Landmark, Phone, UserRound, ShoppingBag, PieChart, Mail, Settings, HelpCircle, Package, ListTodo, ShoppingCart, Receipt } from 'lucide-react';
import { cn } from '../../utils/cn';

const INITIAL_TABS = [
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


export function TabList() {
    const [tabs, setTabs] = useState(() => {
        const saved = localStorage.getItem('tabs-layout');
        const iconMap = {
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

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const savedTabs = parsed.map(t => ({ ...t, icon: iconMap[t.id] || Package }));

                // Знаходимо вкладки, яких немає в збережених, але є в INITIAL_TABS
                const initialIds = INITIAL_TABS.map(t => t.id);
                const savedIds = savedTabs.map(t => t.id);
                const missingTabs = INITIAL_TABS.filter(t => !savedIds.includes(t.id));

                if (missingTabs.length > 0) {
                    return [...savedTabs, ...missingTabs];
                }
                return savedTabs;
            } catch (e) {
                console.error("Failed to parse saved tabs", e);
                return INITIAL_TABS;
            }
        }
        return INITIAL_TABS;
    });


    const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);
    const [visibleTabs, setVisibleTabs] = useState(tabs);
    const [overflowTabs, setOverflowTabs] = useState([]);
    const [isOverflowOpen, setIsOverflowOpen] = useState(false);

    const containerRef = useRef(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        localStorage.setItem('tabs-layout', JSON.stringify(tabs.map(({ icon, ...rest }) => rest)));
    }, [tabs]);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth - 100; // Буффер
            let currentWidth = 0;
            const newVisible = [];
            const newOverflow = [];

            tabs.forEach((tab) => {
                const tabWidth = tab.pinned ? 40 : 150;
                if (currentWidth + tabWidth < containerWidth) {
                    newVisible.push(tab);
                    currentWidth += tabWidth;
                } else {
                    newOverflow.push(tab);
                }
            });

            setVisibleTabs(newVisible);
            setOverflowTabs(newOverflow);
        };

        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) observer.observe(containerRef.current);

        handleResize();

        return () => observer.disconnect();
    }, [tabs]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setTabs((items) => {
                const oldIndex = items.findIndex((t) => t.id === active.id);
                const newIndex = items.findIndex((t) => t.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const togglePin = (id) => {
        setTabs(prev => {
            const newTabs = prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t);
            // Закріплені перші
            return [...newTabs.filter(t => t.pinned), ...newTabs.filter(t => !t.pinned)];
        });
    };

    const closeTab = (id) => {
        setTabs(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="w-full bg-[#f8f9fa] border-b border-[#dee2e6]">
            <div className="flex items-center max-w-full" ref={containerRef}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={visibleTabs.map(t => t.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex overflow-hidden h-[40px] items-end">
                            {visibleTabs.map((tab) => (
                                <TabItem
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTabId === tab.id}
                                    onSelect={(t) => setActiveTabId(t.id)}
                                    onClose={closeTab}
                                    onPin={() => togglePin(tab.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {overflowTabs.length > 0 && (
                    <div className="relative ml-auto px-2 h-[40px] flex items-center bg-[#f8f9fa] border-l border-[#dee2e6]">
                        <button
                            onClick={() => setIsOverflowOpen(!isOverflowOpen)}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-sm bg-[#3476e1] hover:bg-[#2b65c9] shadow-md transition-all duration-200 relative transform active:scale-95",
                                isOverflowOpen && "bg-[#2557ae]"
                            )}
                        >
                            <ChevronDown size={18} strokeWidth={3} className={cn("text-white transition-transform duration-300", isOverflowOpen && "rotate-180")} />
                            <span className="absolute -top-1.5 -right-1.5 bg-[#ea4335] text-white text-[10px] font-bold rounded-full w-[17px] h-[17px] flex items-center justify-center ring-2 ring-white shadow-sm">
                                {overflowTabs.length}
                            </span>
                        </button>

                        <OverflowMenu
                            tabs={overflowTabs}
                            activeTabId={activeTabId}
                            isOpen={isOverflowOpen}
                            onToggle={setIsOverflowOpen}
                            onSelect={(t) => {
                                setActiveTabId(t.id);
                                setIsOverflowOpen(false);
                            }}
                            onClose={closeTab}
                            onPin={togglePin}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
