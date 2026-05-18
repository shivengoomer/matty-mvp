import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Square, 
  Circle, 
  Type, 
  ArrowRight, 
  Save, 
  Download, 
  Trash2,
  Layers,
  Zap,
  Command as CommandIcon,
  X
} from "lucide-react";

const COMMANDS = [
  { id: "add-rect", label: "Add Rectangle", icon: <Square size={16} />, action: "RECT" },
  { id: "add-circle", label: "Add Circle", icon: <Circle size={16} />, action: "CIRCLE" },
  { id: "add-text", label: "Add Text", icon: <Type size={16} />, action: "TEXT" },
  { id: "save", label: "Save Design", icon: <Save size={16} />, action: "SAVE" },
  { id: "export-png", label: "Export as PNG", icon: <Download size={16} />, action: "EXPORT_PNG" },
  { id: "group", label: "Group Selected", icon: <Layers size={16} />, action: "GROUP" },
  { id: "ungroup", label: "Ungroup Selected", icon: <Layers size={16} />, action: "UNGROUP" },
  { id: "delete", label: "Delete Selected", icon: <Trash2 size={16} />, action: "DELETE" },
];

export default function CommandPalette({ isOpen, onClose, onAction }) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      // Small delay to ensure focus after animation
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      onAction(filtered[selectedIndex].action);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center px-6 h-16 border-b border-gray-100">
              <Search className="text-gray-400 mr-4" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                placeholder="Search commands or add elements..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 text-lg placeholder-gray-400 font-medium"
              />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ESC</span>
                </div>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                    <Zap size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No commands found matching "{search}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      onClick={() => { onAction(cmd.action); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all group
                        ${idx === selectedIndex ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <div className={`
                        flex h-10 w-10 items-center justify-center rounded-xl transition-colors
                        ${idx === selectedIndex ? 'bg-white/20' : 'bg-gray-100 text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50'}
                      `}>
                        {cmd.icon}
                      </div>
                      <div className="flex-1">
                        <span className="block font-bold text-sm tracking-tight">{cmd.label}</span>
                        {idx === selectedIndex && (
                          <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Press Enter to run</span>
                        )}
                      </div>
                      <ArrowRight 
                        size={16} 
                        className={`transition-all ${idx === selectedIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-gray-500 shadow-sm">↓↑</kbd>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                   <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-gray-500 shadow-sm">↵</kbd>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CommandIcon size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Command Palette</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
