import { useCallback, useRef, useState } from "react";
import { fabric } from "fabric";

export const useHistory = ({ canvas, saveCallback }) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasHistory = useRef([]);
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback((skip = false) => {
    if (!canvas) return;

    const currentState = canvas.toJSON([
      "name",
      "gradientAngle",
      "selectable",
      "hasControls",
      "linkData",
      "editable",
      "extensionType",
      "extension",
      "id",
      "evented",
      "lockMovementX",
      "lockMovementY",
    ]);
    const json = JSON.stringify(currentState);

    if (!skip && !skipSave.current) {
      canvasHistory.current.push(json);
      setHistoryIndex(canvasHistory.current.length - 1);
    }

    const workspace = canvas.getObjects().find((obj) => obj.name === "clip");
    const height = workspace?.height || 0;
    const width = workspace?.width || 0;

    saveCallback?.({
      json,
      height,
      width,
    });
  }, [canvas, saveCallback]);

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas.clear();
      canvas.renderAll();

      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(canvasHistory.current[previousIndex]);

      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setHistoryIndex(previousIndex);
        skipSave.current = false;
      });
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas.clear();
      canvas.renderAll();

      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(canvasHistory.current[nextIndex]);

      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setHistoryIndex(nextIndex);
        skipSave.current = false;
      });
    }
  }, [canRedo, canvas, historyIndex]);

  return {
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistoryIndex,
    canvasHistory,
  };
};
