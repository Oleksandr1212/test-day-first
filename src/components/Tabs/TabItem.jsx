import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Pin } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';

export function TabItem({ tab, isActive, onSelect, onClose, onPin, className }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tab.id });

    const style = {
        transform: transform ? CSS.Translate.toString({
            ...transform,
            y: 0,
        }) : undefined,
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    const Icon = tab.icon;

    const [showMenu, setShowMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e) => {
        e.preventDefault();
        setIsHovered(false);
        setMenuPos({ x: e.clientX, y: e.clientY });
        setShowMenu(true);
    };

    const handleMouseEnter = (e) => {
        if (!tab.pinned || isDragging || showMenu) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.bottom
        });
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    useEffect(() => {
        const handleClick = () => setShowMenu(false);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        if (isDragging) setIsHovered(false);
    }, [isDragging]);

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={() => onSelect(tab)}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                    "group relative flex items-center h-[40px] px-4 min-w-[120px] max-w-[200px] cursor-pointer select-none transition-all duration-150 border-r border-[#dee2e6]",
                    isActive
                        ? "bg-white text-[#1a1c1e] border-t-[3px] border-r-0 border-[#1877f2] font-semibold z-10 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                        : "bg-[#f8f9fa] text-[#5f6368] hover:bg-[#eceef1]",
                    isDragging && "opacity-50 shadow-lg scale-105 z-50",
                    showMenu && "z-30",
                    tab.pinned && "min-w-[48px] max-w-[48px] px-2 justify-center",
                    className
                )}
            >
                <div className="flex items-center gap-2.5 overflow-hidden pointer-events-none">
                    {Icon && (
                        <Icon
                            size={18}
                            className={cn(isActive ? "text-[#1877f2]" : "text-[#70757a]")}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                    )}
                    {!tab.pinned && (
                        <span className="text-[13px] font-medium truncate tracking-tight">
                            {tab.title}
                        </span>
                    )}
                </div>

                {!tab.pinned && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(tab.id);
                        }}
                        className="ml-auto p-0.5 rounded-full hover:bg-[#d93025] text-[#5f6368] hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                        <X size={10} strokeWidth={2.5} />
                    </button>
                )}

                {tab.pinned && (
                    <div className="absolute top-[2px] right-[2px]">
                        <Pin size={8} className="text-[#1877f2] rotate-45" fill="currentColor" />
                    </div>
                )}
            </div>

            {isHovered && tab.pinned && createPortal(
                <div
                    className="fixed pointer-events-none z-[9999] flex flex-col items-center animate-in fade-in zoom-in-95 duration-150"
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y + 8,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-[#e0e0e0]">
                        {Icon && <Icon size={16} className="text-[#444746]" strokeWidth={2} />}
                        <span className="text-[13px] font-medium text-[#444746] whitespace-nowrap">
                            {tab.title}
                        </span>
                    </div>
                </div>,
                document.body
            )}


            {showMenu && createPortal(
                <div
                    className="fixed bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-lg border border-gray-200 py-1.5 z-[9999] min-w-[160px]"
                    style={{ left: menuPos.x, top: menuPos.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPin();
                            setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#3c4043] hover:bg-[#f1f3f4] transition-colors text-left"
                    >
                        <Pin size={16} className="text-[#5f6368]" />
                        {tab.pinned ? "Tab lösen" : "Tab anpinnen"}
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}
