// src/store/shapesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shapes: [],
  history: [],
  future: [],
};

const shapesSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    addShape(state, action) {
      state.history.push(JSON.stringify(state.shapes));
      state.shapes.push(action.payload);
      state.future = [];
    },
    updateShape(state, action) {
      const { id, newAttrs } = action.payload;
      state.shapes = state.shapes.map((s) =>
        s.id === id ? { ...s, ...newAttrs } : s
      );
    },
    batchUpdateShapes(state, action) {
      const { updates } = action.payload; // array of {id, newAttrs}
      state.shapes = state.shapes.map((s) => {
        const update = updates.find(u => u.id === s.id);
        return update ? { ...s, ...update.newAttrs } : s;
      });
    },
    pushHistory(state) {
      state.history.push(JSON.stringify(state.shapes));
      state.future = [];
    },
    removeShape(state, action) {
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = state.shapes.filter((s) => s.id !== action.payload);
      state.future = [];
    },
    clearShapes(state) {
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = [];
      state.future = [];
    },
    setShapes(state, action) {
      state.shapes = action.payload;
    },
    undo(state) {
      if (state.history.length === 0) return;
      state.future.push(JSON.stringify(state.shapes));
      const prev = JSON.parse(state.history.pop());
      state.shapes = prev;
    },
    redo(state) {
      if (state.future.length === 0) return;
      state.history.push(JSON.stringify(state.shapes));
      const next = JSON.parse(state.future.pop());
      state.shapes = next;
    },
    replaceAll(state, action) {
      state.shapes = action.payload;
      state.history = [];
      state.future = [];
    },
    toggleVisibility(state, action) {
      state.history.push(JSON.stringify(state.shapes));
      const id = action.payload;
      state.shapes = state.shapes.map((s) =>
        s.id === id ? { ...s, visible: s.visible === false ? true : false } : s
      );
    },
    duplicateShape(state, action) {
      const id = action.payload;
      const original = state.shapes.find((s) => s.id === id);
      if (original) {
        state.history.push(JSON.stringify(state.shapes));
        const newNode = {
          ...original,
          id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          x: original.x + 20,
          y: original.y + 20,
        };
        state.shapes.push(newNode);
        state.future = [];
      }
    },
    groupShapes(state, action) {
      const { ids, groupId } = action.payload;
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = state.shapes.map((s) =>
        ids.includes(String(s.id)) ? { ...s, groupId } : s
      );
      state.future = [];
    },
    ungroupShapes(state, action) {
      const { groupId } = action.payload;
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = state.shapes.map((s) =>
        s.groupId === groupId ? { ...s, groupId: null } : s
      );
      state.future = [];
    },
  },
});

export const {
  addShape,
  updateShape,
  batchUpdateShapes,
  pushHistory,
  removeShape,
  clearShapes,
  undo,
  redo,
  setShapes,
  replaceAll,
  toggleVisibility,
  duplicateShape,
  groupShapes,
  ungroupShapes,
} = shapesSlice.actions;
export default shapesSlice.reducer;
