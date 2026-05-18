import React from "react";
import { 
  Trash2, 
  Copy, 
  Layers, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

export default function FloatingToolbar({ editor }) {
  const selectedObject = editor?.selectedObjects[0];

  if (!selectedObject) return null;

  // We can calculate position based on the selected object's bounding box
  // For now, let's keep it simple and show it at a fixed bottom position or relative to selection
  
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-gray-200 p-1.5 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <ToolbarButton 
        icon={<ArrowUp size={16} />} 
        onClick={() => editor?.bringForward()} 
        label="Bring Forward"
      />
      <ToolbarButton 
        icon={<ArrowDown size={16} />} 
        onClick={() => editor?.sendBackwards()} 
        label="Send Backward"
      />
      <div className="w-px h-4 bg-gray-100 mx-1" />
      <ToolbarButton 
        icon={<Trash2 size={16} />} 
        onClick={() => editor?.delete()} 
        label="Delete"
        variant="danger"
      />
    </div>
  );
}

function ToolbarButton({ icon, onClick, label, variant = 'default' }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        p-2 rounded-xl transition-all duration-200 flex items-center justify-center
        ${variant === 'danger' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-600 hover:text-blue-600'}
      `}
    >
      {icon}
    </button>
  );
}
