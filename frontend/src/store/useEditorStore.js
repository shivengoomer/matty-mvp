import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useEditorStore = create(subscribeWithSelector((set) => ({
  // Canvas State
  scale: 1,
  x: 0,
  y: 0,
  selectedIds: [],
  
  // UI State
  isDragging: false,
  showGuides: true,
  snapToGrid: true,
  gridSize: 20,
  
  // History
  history: [],
  future: [],
  
  // Actions
  setScale: (scale) => set({ scale }),
  setPosition: (x, y) => set({ x, y }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  
  zoomIn: () => set((state) => ({ scale: Math.min(state.scale * 1.1, 5) })),
  zoomOut: () => set((state) => ({ scale: Math.max(state.scale / 1.1, 0.1) })),
  resetZoom: () => set({ scale: 1, x: 0, y: 0 }),
  
  // Multi-select helpers
  toggleSelection: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds.filter((i) => i !== id)
      : [...state.selectedIds, id],
  })),
})));

export default useEditorStore;
