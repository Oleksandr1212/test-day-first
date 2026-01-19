import React, { useEffect, useRef } from 'react';
import { X, Pin } from 'lucide-react';
import { cn } from '../../utils/cn';

export function OverflowMenu({ tabs, activeTabId, onSelect, onClose, isOpen, onToggle }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
                onToggle(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-80 bg-white border border-[#dee2e6] shadow-[0_10px_35px_rgba(0,0,0,0.1)] rounded-lg py-1.5 z-50 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-300"
        >
            <div className="max-h-[600px] overflow-y-auto scroll-smooth custom-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => onSelect(tab)}
                            className={cn(
                                "group flex items-center px-4 py-3 cursor-pointer hover:bg-[#f8f9fa] transition-all relative border-b border-gray-50 last:border-0",
                                activeTabId === tab.id ? "bg-[#e8f0fe] text-[#1877f2]" : "text-[#444746]"
                            )}
                        >
                            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                <div className={cn(
                                    "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg shadow-sm border",
                                    activeTabId === tab.id
                                        ? "bg-white border-[#1877f2] text-[#1877f2]"
                                        : "bg-[#f1f3f4] border-transparent text-[#5f6368]"
                                )}>
                                    {Icon && <Icon size={20} strokeWidth={2.5} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-semibold truncate tracking-tight">
                                        {tab.title}
                                    </span>
                                    {tab.pinned && (
                                        <span className="text-[10px] text-[#1877f2] font-medium flex items-center gap-1">
                                            <Pin size={10} className="rotate-45" fill="currentColor" /> Pinned
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose(tab.id);
                                }}
                                className="ml-3 p-2 rounded-full hover:bg-[rgba(217,48,37,0.1)] text-[#70757a] hover:text-[#d93025] opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

