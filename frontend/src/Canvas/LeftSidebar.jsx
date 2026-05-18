import React, { useState } from "react";
import { 
  Square, 
  Circle, 
  Type, 
  Image as ImageIcon, 
  MousePointer2, 
  PenTool, 
  Layers,
  Search,
  Palette,
  Star,
  Heart,
  Hexagon,
  Trophy,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MediaUploader from "../Components/MediaUploader";

const ICON_LIBRARY = [
  { name: "Star", icon: Star, type: "star" },
  { name: "Heart", icon: Heart, type: "heart" },
  { name: "Hexagon", icon: Hexagon, type: "hexagon" },
  { name: "Trophy", icon: Trophy, type: "trophy" },
];

export default function LeftSidebar({ editor }) {
  const [activeTab, setActiveTab] = useState("tools");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = ICON_LIBRARY.filter(icon => 
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-16 md:w-72 shrink-0 flex flex-col border-r border-gray-200 bg-white/80 backdrop-blur-xl z-10 overflow-hidden"
    >
      <div className="flex p-2 gap-1 border-b border-gray-100">
        <TabButton active={activeTab === 'tools'} onClick={() => setActiveTab("tools")} icon={<MousePointer2 size={16} />} label="Tools" />
        <TabButton active={activeTab === 'layers'} onClick={() => setActiveTab("layers")} icon={<Layers size={16} />} label="Layers" />
        <TabButton active={activeTab === 'elements'} onClick={() => setActiveTab("elements")} icon={<Square size={16} />} label="Elements" />
        <TabButton active={activeTab === 'brand'} onClick={() => setActiveTab("brand")} icon={<Palette size={16} />} label="Brand" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Basics</h3>
              <div className="grid grid-cols-1 gap-2">
                <ToolButton 
                  icon={<Square size={18} />} 
                  label="Rectangle" 
                  onClick={() => editor?.addRectangle()} 
                  onDragStart={(e) => e.dataTransfer.setData("itemType", "rect")}
                />
                <ToolButton 
                  icon={<Square size={18} />} 
                  className="rounded-lg" 
                  label="Soft Rectangle" 
                  onClick={() => editor?.addSoftRectangle()} 
                  onDragStart={(e) => e.dataTransfer.setData("itemType", "soft-rect")}
                />
                <ToolButton 
                  icon={<Circle size={18} />} 
                  label="Circle" 
                  onClick={() => editor?.addCircle()} 
                  onDragStart={(e) => e.dataTransfer.setData("itemType", "circle")}
                />
                <ToolButton 
                  icon={<PenTool size={18} />} 
                  label="Triangle" 
                  onClick={() => editor?.addTriangle()} 
                  onDragStart={(e) => e.dataTransfer.setData("itemType", "triangle")}
                />
                <ToolButton 
                  icon={<Type size={18} />} 
                  label="Text" 
                  onClick={() => editor?.addText("New Text")} 
                  onDragStart={(e) => e.dataTransfer.setData("itemType", "text")}
                />
              </div>

              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 pt-4">Uploads</h3>
              <MediaUploader 
                editor={editor}
                onUploadComplete={(url) => {
                  // This is now a fallback since MediaUploader handles optimistic adds
                  // but we might still want to trigger some side effect or just ensure sync
                }} 
              />
            </motion.div>
          )}

          {activeTab === "layers" && (
            <motion.div
              key="layers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Canvas Layers</h3>
              <div className="space-y-1">
                {editor?.objects.slice().reverse().map((obj, index) => (
                  <button
                    key={index}
                    onClick={() => editor?.selectObject(obj)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                      editor?.selectedObjects.includes(obj)
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        editor?.selectedObjects.includes(obj) ? "bg-white/20" : "bg-white border border-gray-100"
                      }`}>
                        {obj.type === "rect" && <Square size={14} />}
                        {obj.type === "circle" && <Circle size={14} />}
                        {obj.type === "triangle" && <PenTool size={14} />}
                        {obj.type === "i-text" && <Type size={14} />}
                        {obj.type === "image" && <ImageIcon size={14} />}
                        {!["rect", "circle", "triangle", "i-text", "image"].includes(obj.type) && <MousePointer2 size={14} />}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-tight">
                        {obj.type === "i-text" ? (obj.text.substring(0, 10) || "Text") : obj.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editor?.toggleVisibility(obj);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          editor?.selectedObjects.includes(obj) ? "hover:bg-white/20" : "hover:bg-gray-200"
                        }`}
                      >
                        {obj.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                    </div>
                  </button>
                ))}
                {editor?.objects.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Layers className="text-gray-200 mb-2" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">No layers yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "elements" && (
            <motion.div
              key="elements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => editor?.addDiamond()}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("itemType", "diamond")}
                  className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-500 hover:bg-white transition-all group p-4"
                >
                  <Square className="rotate-45 text-gray-400 group-hover:text-blue-500" size={24} />
                  <span className="mt-2 text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase">Diamond</span>
                </button>
                {filteredIcons.map(item => (
                  <button 
                    key={item.name}
                    className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-500 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group p-4"
                  >
                    <item.icon className="text-gray-400 group-hover:text-blue-500 transition-colors" size={24} />
                    <span className="mt-2 text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase tracking-tighter">{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "brand" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <section>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">Colors</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['#000000', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6'].map(color => (
                    <button 
                      key={color} 
                      onClick={() => editor?.changeFillColor(color)}
                      className="w-full aspect-square rounded-lg border border-gray-200 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">Typography</h3>
                <div className="space-y-2">
                  <div 
                    onClick={() => editor?.addText("Heading", { fontSize: 48, fontWeight: "bold" })}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("itemType", "text");
                      e.dataTransfer.setData("itemData", "Heading");
                    }}
                    className="p-3 bg-gray-50 rounded-xl text-lg font-bold border border-gray-100 cursor-pointer hover:bg-white hover:border-blue-500 transition-all"
                  >
                    Heading
                  </div>
                  <div 
                    onClick={() => editor?.addText("Body Text", { fontSize: 24 })}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("itemType", "text");
                      e.dataTransfer.setData("itemData", "Body Text");
                    }}
                    className="p-3 bg-gray-50 rounded-xl text-sm font-medium border border-gray-100 cursor-pointer hover:bg-white hover:border-blue-500 transition-all"
                  >
                    Body Text
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
        active 
          ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100" 
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter hidden md:block">{label}</span>
    </button>
  );
}

function ToolButton({ icon, label, onClick, active, className = "", onDragStart }) {
  return (
    <button
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-gray-600 hover:bg-gray-50"
      } ${className}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        active ? "bg-white/20" : "bg-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600"
      }`}>
        {icon}
      </div>
      <span className="text-xs font-semibold hidden md:block">{label}</span>
    </button>
  );
}
