import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Lock, 
  Unlock,
  Group,
  Ungroup
} from 'lucide-react';

const ContextMenu = ({ 
  visible, 
  position, 
  onAction, 
  onClose 
}) => {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
        }}
        className="w-48 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-xl p-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => onAction('duplicate')} icon={<Copy size={14} />} label="Duplicate" shortcut="⌘D" />
        <MenuItem onClick={() => onAction('group')} icon={<Group size={14} />} label="Group" shortcut="⌘G" />
        <MenuItem onClick={() => onAction('ungroup')} icon={<Ungroup size={14} />} label="Ungroup" shortcut="⇧⌘G" />
        <div className="h-px bg-gray-100 my-1" />
        <MenuItem onClick={() => onAction('forward')} icon={<ArrowUp size={14} />} label="Bring to Front" />
        <MenuItem onClick={() => onAction('backward')} icon={<ArrowDown size={14} />} label="Send to Back" />
        <div className="h-px bg-gray-100 my-1" />
        <MenuItem onClick={() => onAction('delete')} icon={<Trash2 size={14} />} label="Delete" shortcut="⌫" variant="danger" />
      </motion.div>
      <div 
        className="fixed inset-0 z-[999]" 
        onMouseDown={onClose}
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />
    </AnimatePresence>
  );
};

const MenuItem = ({ onClick, icon, label, shortcut, variant = 'default' }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`
      w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
      ${variant === 'danger' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-700'}
    `}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
    {shortcut && <span className="text-[10px] text-gray-400 font-mono">{shortcut}</span>}
  </button>
);

export default ContextMenu;
