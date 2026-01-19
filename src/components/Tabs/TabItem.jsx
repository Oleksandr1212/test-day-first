import React from 'react';
import { createPortal } from 'react-dom';
import { X, Pin, PinOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';

export function TabItem({ tab, isActive, onSelect, onClose, onPin, isOverflow = false, className }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    const Icon = tab.icon;

    const [showMenu, setShowMenu] = React.useState(false);
    const [menuPos, setMenuPos] = React.useState({ x: 0, y: 0 });

    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
        setShowMenu(true);
    };

    React.useEffect(() => {
        const handleClick = () => setShowMenu(false);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onSelect(tab)}
            onContextMenu={handleContextMenu}
            title={tab.pinned ? tab.title : undefined}
            className={cn(
                "group relative flex items-center h-[40px] px-4 min-w-[120px] max-w-[200px] cursor-pointer select-none transition-all duration-150 border-r border-[#dee2e6]",
                isActive
                    ? "bg-white text-[#1a1c1e] border-t-[3px] border-[#1877f2] font-semibold z-10 -mt-[3px] h-[43px] shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
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
                    className="ml-auto p-1 rounded-full hover:bg-[rgba(217,48,37,0.1)] text-[#5f6368] hover:text-[#d93025] opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            )}

            {tab.pinned && (
                <div className="absolute top-[2px] right-[2px]">
                    <Pin size={8} className="text-[#1877f2] rotate-45" fill="currentColor" />
                </div>
            )}

            {showMenu && createPortal(
                <div
                    className="fixed bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded border border-gray-200 py-1.5 z-[9999] min-w-[140px]"
                    style={{ left: menuPos.x, top: menuPos.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPin();
                            setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-1.5 text-[13px] text-[#3c4043] hover:bg-[#f1f3f4] transition-colors text-left"
                    >
                        <Pin size={14} className="text-[#5f6368]" />
                        {tab.pinned ? "Tab lösen" : "Tab anpinnen"}
                    </button>
                </div>,
                document.body
            )}

        </div>
    );
}
