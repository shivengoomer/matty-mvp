import { useEffect } from "react";
import { fabric } from "fabric";

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  setObjects,
  clearSelectionCallback,
  save,
  socket,
}) => {
  useEffect(() => {
    if (canvas) {
      const updateObjects = () => {
        setObjects(canvas.getObjects().filter(obj => obj.name !== "clip"));
      };

      const handleObjectChange = (options) => {
        const obj = options.target;
        if (obj && obj.name === "clip") return;
        
        // Don't emit if the change was triggered by a network sync
        if (canvas.__isSyncing) return;

        save();
        updateObjects();

        if (socket) {
          const json = obj ? obj.toJSON() : canvas.toJSON();
          socket.emit("canvas-update", {
            type: options.e ? "modified" : "added",
            object: json,
          });
        }
      };

      canvas.on("object:added", (e) => {
        if (canvas.__isSyncing) return;
        save();
        updateObjects();
        socket?.emit("canvas-update", { type: "added", object: e.target.toJSON() });
      });

      canvas.on("object:removed", (e) => {
        if (canvas.__isSyncing) return;
        save();
        updateObjects();
        socket?.emit("canvas-update", { type: "removed", objectId: e.target.id || e.target.name });
      });

      canvas.on("object:modified", (e) => {
        if (canvas.__isSyncing) return;
        save();
        updateObjects();
        socket?.emit("canvas-update", { type: "modified", object: e.target.toJSON() });
      });

      canvas.on("selection:created", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  }, [
    canvas,
    setSelectedObjects,
    setObjects,
    clearSelectionCallback,
    save,
    socket,
  ]);
};
