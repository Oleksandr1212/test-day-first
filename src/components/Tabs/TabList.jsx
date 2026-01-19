import React, { useState, useEffect, useRef } from 'react';
import { initializeAuth, loadTabs, saveTabs, migrateFromLocalStorage, initializeNewUser } from '../../firebase/tabsService';
import { INITIAL_TABS, ICON_MAP } from '../../firebase/defaultTabs';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { TabItem } from './TabItem';
import { OverflowMenu } from './OverflowMenu';
import { ChevronDown, LayoutDashboard, Landmark, Phone, UserRound, ShoppingBag, PieChart, Mail, Settings, HelpCircle, Package, ListTodo, ShoppingCart, Receipt } from 'lucide-react';
import { cn } from '../../utils/cn';



export function TabList() {
    const navigate = useNavigate();
    const location = useLocation();

    const [tabs, setTabs] = useState(INITIAL_TABS);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initFirebase = async () => {
            try {
                const uid = await initializeAuth();
                setUserId(uid);

                await migrateFromLocalStorage(uid);

                const firebaseTabs = await loadTabs(uid);
                if (firebaseTabs && firebaseTabs.length > 0) {
                    const tabsWithIcons = firebaseTabs.map(t => ({
                        ...t,
                        icon: ICON_MAP[t.id] || Package
                    }));
                    setTabs(tabsWithIcons);
                } else {
                    await initializeNewUser(uid, INITIAL_TABS);
                    setTabs(INITIAL_TABS);
                }
            } catch (error) {
                console.error('Firebase initialization failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initFirebase();
    }, []);


    const [activeTabId, setActiveTabId] = useState(null);
    const [visibleTabs, setVisibleTabs] = useState([]);
    const [overflowTabs, setOverflowTabs] = useState([]);
    const [isOverflowOpen, setIsOverflowOpen] = useState(false);

    useEffect(() => {
        const currentTab = tabs.find(t => t.url === location.pathname);
        if (currentTab) {
            setActiveTabId(currentTab.id);
        } else if (location.pathname === '/') {
            const firstTab = tabs[0];
            if (firstTab) {
                navigate(firstTab.url, { replace: true });
            }
        }
    }, [location.pathname, tabs, navigate]);

    const containerRef = useRef(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (userId && !isLoading) {
            saveTabs(userId, tabs);
        }
    }, [tabs, userId, isLoading]);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth - 100;
            let currentWidth = 0;
            const newVisible = [];
            const newOverflow = [];

            tabs.forEach((tab) => {
                const tabWidth = tab.pinned ? 40 : 120;
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
                        <div className="flex overflow-hidden h-[40px] items-end flex-1">
                            {visibleTabs.map((tab) => (
                                <TabItem
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTabId === tab.id}
                                    onSelect={(t) => navigate(t.url)}
                                    onClose={closeTab}
                                    onPin={() => togglePin(tab.id)}
                                    className="flex-1 min-w-[120px] max-w-[200px]"
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
                        </button>

                        <OverflowMenu
                            tabs={overflowTabs}
                            activeTabId={activeTabId}
                            isOpen={isOverflowOpen}
                            onToggle={setIsOverflowOpen}
                            onSelect={(t) => {
                                setTabs(prev => {
                                    const tabToMove = prev.find(tab => tab.id === t.id);
                                    if (!tabToMove) return prev;

                                    const others = prev.filter(tab => tab.id !== t.id);

                                    if (tabToMove.pinned) {
                                        return [tabToMove, ...others];
                                    }

                                    const firstUnpinnedIndex = others.findIndex(tab => !tab.pinned);

                                    if (firstUnpinnedIndex === -1) {
                                        return [...others, tabToMove];
                                    }

                                    const newTabs = [...others];
                                    newTabs.splice(firstUnpinnedIndex, 0, tabToMove);
                                    return newTabs;
                                });
                                navigate(t.url);
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
