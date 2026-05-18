import React from "react";
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  Download, 
  Save, 
  ChevronLeft,
  Plus,
  Minus,
  Maximize,
  Share2,
  FileJson
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar({ editor, onSave, isSaving, designName, setDesignName }) {
  const [isEditingName, setIsEditingName] = React.useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-xl px-6 z-50 w-full relative">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
            <ChevronLeft size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight">Dashboard</span>
        </Link>
        <div className="h-6 w-px bg-gray-100" />
        <div className="flex flex-col min-w-[150px]">
          {isEditingName ? (
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
              className="text-sm font-bold text-gray-900 leading-none mb-1 bg-transparent border-b border-blue-500 outline-none w-full"
              autoFocus
            />
          ) : (
            <span 
              onClick={() => setIsEditingName(true)}
              className="text-sm font-bold text-gray-900 leading-none mb-1 cursor-pointer hover:bg-gray-50 px-1 -ml-1 rounded transition-colors"
            >
              {designName || "Untitled Design"}
            </span>
          )}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {isSaving ? "Saving..." : "Last saved 2m ago"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50">
        <div className="flex items-center gap-1">
          <IconButton 
            icon={<Undo2 size={16} />} 
            onClick={() => editor?.undo()} 
            disabled={!editor?.canUndo()}
            label="Undo" 
          />
          <IconButton 
            icon={<Redo2 size={16} />} 
            onClick={() => editor?.redo()} 
            disabled={!editor?.canRedo()}
            label="Redo" 
          />
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1">
          <IconButton icon={<Minus size={16} />} onClick={() => editor?.autoResize()} label="Zoom Out" />
          <button 
            className="px-2 py-1 text-[10px] font-bold text-gray-600 hover:text-blue-600 transition-colors min-w-[45px]"
          >
            Fit
          </button>
          <IconButton icon={<Plus size={16} />} onClick={() => editor?.autoResize()} label="Zoom In" />
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <IconButton icon={<Trash2 size={16} />} onClick={() => editor?.delete()} label="Delete Selected" variant="danger" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button onClick={() => editor?.savePng()} className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
            <Download size={14} /> PNG
          </button>
          <button onClick={() => editor?.saveJson()} className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 border-l border-gray-200">
            <FileJson size={14} /> JSON
          </button>
        </div>
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
        >
          <Save size={14} /> {isSaving ? "Saving..." : "Save Design"}
        </button>
        <button className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10">
          <Share2 size={16} />
        </button>
      </div>
    </header>
  );
}

function IconButton({ icon, onClick, label, variant = 'default', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        p-2 rounded-xl transition-all duration-200 flex items-center justify-center
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
        ${variant === 'danger' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-white hover:text-blue-600 hover:shadow-sm'}
      `}
    >
      {icon}
    </button>
  );
}
