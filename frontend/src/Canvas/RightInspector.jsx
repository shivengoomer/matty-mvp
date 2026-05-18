import React from "react";
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough
} from "lucide-react";

export default function RightInspector({ editor }) {
  const selectedObject = editor?.selectedObjects[0];

  if (!selectedObject) {
    return (
      <aside className="w-72 shrink-0 border-l border-gray-200 bg-white/80 backdrop-blur-xl p-6 hidden lg:flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
          <Type size={24} />
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">No selection</h3>
        <p className="text-xs text-gray-400 font-medium px-4">Select an element on the canvas to edit its properties.</p>
      </aside>
    );
  }

  const isText = selectedObject.type === "i-text";

  return (
    <aside className="w-72 shrink-0 border-l border-gray-200 bg-white/80 backdrop-blur-xl p-6 hidden lg:block overflow-y-auto">
      <div className="space-y-8">
        {/* Layering & Actions */}
        <section>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <ActionButton 
              icon={<ArrowUp size={16} />} 
              label="Forward" 
              onClick={() => editor?.bringForward()} 
            />
            <ActionButton 
              icon={<ArrowDown size={16} />} 
              label="Backward" 
              onClick={() => editor?.sendBackwards()} 
            />
            <ActionButton 
              icon={<Trash2 size={16} />} 
              label="Delete" 
              variant="danger" 
              onClick={() => editor?.delete()} 
            />
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Fill Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={editor?.getActiveFillColor()}
                  onChange={(e) => editor?.changeFillColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 p-1 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-tight">
                  {editor?.getActiveFillColor()}
                </span>
              </div>
            </div>

            {!isText && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Stroke Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={editor?.getActiveStrokeColor()}
                      onChange={(e) => editor?.changeStrokeColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 p-1 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-tight">
                      {editor?.getActiveStrokeColor()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Stroke Width</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={editor?.getActiveStrokeWidth()}
                    onChange={(e) => editor?.changeStrokeWidth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Opacity</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={editor?.getActiveOpacity()}
                onChange={(e) => editor?.changeOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </section>

        {/* Text Styling */}
        {isText && (
          <section>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Typography</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Font Family</label>
                <select 
                  value={editor?.getActiveFontFamily()}
                  onChange={(e) => editor?.changeFontFamily(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Size</label>
                  <input 
                    type="number" 
                    value={editor?.getActiveFontSize()}
                    onChange={(e) => editor?.changeFontSize(parseInt(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Weight</label>
                  <select 
                    value={editor?.getActiveFontWeight()}
                    onChange={(e) => editor?.changeFontWeight(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="300">Light</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
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

              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
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
                <IconButton 
                  icon={<Strikethrough size={14} />} 
                  active={editor?.getActiveFontLinethrough()}
                  onClick={() => editor?.changeFontLinethrough(!editor?.getActiveFontLinethrough())} 
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}

function ActionButton({ icon, label, onClick, variant = 'default' }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border
        ${variant === 'danger' 
          ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200' 
          : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/5'}
      `}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function IconButton({ icon, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 p-2 rounded-lg transition-all flex items-center justify-center
        ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
      `}
    >
      {icon}
    </button>
  );
}
