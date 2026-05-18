import React from "react";
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Trash2,
  Copy,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ContextualToolbar({ editor }) {
  const selectedObject = editor?.selectedObjects[0];

  if (!selectedObject) return null;

  const isText = selectedObject.type === "i-text";

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-2xl shadow-xl z-30 overflow-x-auto max-w-[90%] whitespace-nowrap">
      {/* Fill Color */}
      <div className="flex items-center gap-1.5 px-2 border-r border-gray-100">
        <input 
          type="color" 
          value={editor?.getActiveFillColor()}
          onChange={(e) => editor?.changeFillColor(e.target.value)}
          className="w-6 h-6 rounded-md border border-gray-100 cursor-pointer"
        />
        <span className="text-[10px] font-bold text-gray-400 uppercase">Fill</span>
      </div>

      {isText && (
        <div className="flex items-center gap-1 px-2 border-r border-gray-100">
          <IconButton 
            icon={<Bold size={14} />} 
            active={editor?.getActiveFontWeight() === "bold" || editor?.getActiveFontWeight() === 700}
            onClick={() => editor?.changeFontWeight(editor?.getActiveFontWeight() === "bold" ? "normal" : "bold")} 
          />
          <IconButton 
            icon={<Italic size={14} />} 
            active={editor?.getActiveFontStyle() === "italic"}
            onClick={() => editor?.changeFontStyle(editor?.getActiveFontStyle() === "italic" ? "normal" : "italic")} 
          />
          <IconButton 
            icon={<Underline size={14} />} 
            active={editor?.getActiveFontUnderline()}
            onClick={() => editor?.changeFontUnderline(!editor?.getActiveFontUnderline())} 
          />
          <div className="w-px h-4 bg-gray-100 mx-1" />
          <IconButton 
            icon={<AlignLeft size={14} />} 
            active={editor?.getActiveTextAlign() === "left"}
            onClick={() => editor?.changeTextAlign("left")} 
          />
          <IconButton 
            icon={<AlignCenter size={14} />} 
            active={editor?.getActiveTextAlign() === "center"}
            onClick={() => editor?.changeTextAlign("center")} 
          />
          <IconButton 
            icon={<AlignRight size={14} />} 
            active={editor?.getActiveTextAlign() === "right"}
            onClick={() => editor?.changeTextAlign("right")} 
          />
        </div>
      )}

      <div className="flex items-center gap-1 px-2 border-r border-gray-100">
        <IconButton 
          icon={<ChevronUp size={14} />} 
          onClick={() => editor?.bringForward()} 
          label="Forward"
        />
        <IconButton 
          icon={<ChevronDown size={14} />} 
          onClick={() => editor?.sendBackwards()} 
          label="Backward"
        />
      </div>

      <div className="flex items-center gap-1 px-2">
        <IconButton 
          icon={<Copy size={14} />} 
          onClick={() => editor?.duplicate()} 
          label="Duplicate"
        />
        <IconButton 
          icon={<Trash2 size={14} />} 
          onClick={() => editor?.delete()} 
          label="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
}

function IconButton({ icon, onClick, active, variant = 'default', label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        p-2 rounded-lg transition-all flex items-center justify-center
        ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
        ${variant === 'danger' ? 'hover:text-red-500' : ''}
      `}
    >
      {icon}
    </button>
  );
}
