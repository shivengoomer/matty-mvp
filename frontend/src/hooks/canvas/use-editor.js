import { useCallback, useMemo, useState,useEffect } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import { useHistory } from "./use-history";

// Ensure id and other custom properties are always included in serialization
const JSON_PROPERTIES = [
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
];

const originalToObject = fabric.Object.prototype.toObject;
fabric.Object.prototype.toObject = function (additionalProperties) {
  return originalToObject.call(this, JSON_PROPERTIES.concat(additionalProperties || []));
};

export const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  objects,
  setObjects,
  fontFamily,
  setFontFamily,
  copy,
  paste,
  autoResize,
  save,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  const getWorkspace = () => {
    return canvas?.getObjects().find((obj) => obj.id === "workspace" || obj.name === "clip");
  };

  const center = (object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    canvas?.centerObject(object);
    object.set({
      left: center.x,
      top: center.y,
    });
  };

  const addToCanvas = (object) => {
    center(object);
    // Assign a unique ID if not present for socket sync
    if (!object.id) {
      object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
    }
    canvas?.add(object);
    canvas?.setActiveObject(object);
    canvas?.renderAll();
  };

  return {
    savePng: () => {
      const options = {
        name: "Design",
        format: "png",
        quality: 1,
        multiplier: 2,
      };

      const workspace = getWorkspace();
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = canvas.toDataURL({
        ...options,
        left: workspace.left,
        top: workspace.top,
        width: workspace.width,
        height: workspace.height,
      });

      const link = document.createElement("a");
      link.download = `${options.name}.${options.format}`;
      link.href = dataUrl;
      link.click();
      autoResize();
    },
    saveJpg: () => {
      const options = {
        name: "Design",
        format: "jpg",
        quality: 1,
        multiplier: 2,
      };

      const workspace = getWorkspace();
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = canvas.toDataURL({
        ...options,
        left: workspace.left,
        top: workspace.top,
        width: workspace.width,
        height: workspace.height,
      });

      const link = document.createElement("a");
      link.download = `${options.name}.${options.format}`;
      link.href = dataUrl;
      link.click();
      autoResize();
    },
    saveJson: () => {
      const dataUrl = canvas.toJSON(JSON_PROPERTIES);
      const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataUrl, null, "\t")
      )}`;
      const link = document.createElement("a");
      link.download = "design.json";
      link.href = fileString;
      link.click();
    },
    loadJson: (json) => {
      if (!canvas) return;
      
      const data = typeof json === "string" ? JSON.parse(json) : json;
      
      canvas.__isSyncing = true;
      
      canvas.loadFromJSON(data, () => {
        const objects = canvas.getObjects();
        let workspace = objects.find((obj) => obj.name === "clip" || obj.id === "workspace");
        
        if (!workspace) {
          workspace = new fabric.Rect({
            width: 900,
            height: 1200,
            name: "clip",
            id: "workspace",
            fill: "white",
            selectable: false,
            hasControls: false,
            evented: false,
            shadow: new fabric.Shadow({
              color: "rgba(0,0,0,0.8)",
              blur: 5,
            }),
          });
          canvas.add(workspace);
        } else {
          workspace.set({
            selectable: false,
            hasControls: false,
            evented: false,
            id: "workspace",
            name: "clip"
          });
        }

        workspace.sendToBack();
        canvas.centerObject(workspace);

        objects.forEach((obj) => {
          if (obj !== workspace) {
            obj.set({
              selectable: true,
              hasControls: true,
              evented: true,
              lockMovementX: false,
              lockMovementY: false,
            });
            
            if (!obj.id) {
              obj.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
            }
            obj.setCoords();
          }
        });

        canvas.discardActiveObject();
        canvas.selection = true;
        canvas.requestRenderAll();
        
        // Let autoResize handle the clipPath setting to avoid direct reference issues
        autoResize();
        
        setObjects(canvas.getObjects().filter(o => o !== workspace));
        
        setTimeout(() => {
          canvas.__isSyncing = false;
        }, 100);
      });
    },
    undo,
    redo,
    canUndo,
    canRedo,
    autoResize,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    objects,
    selectObject: (object) => {
      canvas?.setActiveObject(object);
      canvas?.renderAll();
    },
    addCircle: (options) => {
      const object = new fabric.Circle({
        radius: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        ...options,
      });
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    addSoftRectangle: (options) => {
      const object = new fabric.Rect({
        width: 400,
        height: 400,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        rx: 50,
        ry: 50,
        ...options,
      });
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    addRectangle: (options) => {
      const object = new fabric.Rect({
        width: 400,
        height: 400,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        ...options,
      });
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    addTriangle: (options) => {
      const object = new fabric.Triangle({
        width: 400,
        height: 400,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        ...options,
      });
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    addInverseTriangle: (options) => {
      const object = new fabric.Triangle({
        width: 400,
        height: 400,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        angle: 180,
        ...options,
      });
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    addDiamond: (options) => {
      const HEIGHT = 400;
      const WIDTH = 400;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          ...options,
        }
      );
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    addImage: (url, options) => {
      fabric.Image.fromURL(
        url,
        (img) => {
          if (options?.left && options?.top) {
            img.set({
              ...options,
              id: options?.id || `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
            });
            canvas?.add(img);
            canvas?.setActiveObject(img);
            canvas?.renderAll();
          } else {
            if (options) {
              img.set(options);
            }
            addToCanvas(img);
          }
        },
        { crossOrigin: "anonymous" }
      );
    },
    addText: (value, options) => {
      const object = new fabric.IText(value, {
        left: 100,
        top: 100,
        fill: fillColor,
        fontSize: 32,
        fontFamily: fontFamily,
        ...options,
      });
      if (options?.left && options?.top) {
        if (!object.id) {
          object.set("id", `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
        }
        canvas?.add(object);
        canvas?.setActiveObject(object);
        canvas?.renderAll();
      } else {
        addToCanvas(object);
      }
    },
    changeFillColor: (value) => {
      setFillColor(value);
      canvas?.getActiveObjects().forEach((obj) => {
        obj.set({ fill: value });
      });
      canvas?.renderAll();
      save();
    },
    changeStrokeColor: (value) => {
      setStrokeColor(value);
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "text") {
          obj.set({ fill: value });
          return;
        }
        obj.set({ stroke: value });
      });
      canvas?.renderAll();
      save();
    },
    changeStrokeWidth: (value) => {
      setStrokeWidth(value);
      canvas?.getActiveObjects().forEach((obj) => {
        obj.set({ strokeWidth: value });
      });
      canvas?.renderAll();
      save();
    },
    changeOpacity: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        obj.set({ opacity: value });
      });
      canvas?.renderAll();
      save();
    },
    bringForward: () => {
      canvas?.getActiveObjects().forEach((obj) => {
        canvas?.bringForward(obj);
      });
      canvas?.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
      save();
    },
    sendBackwards: () => {
      canvas?.getActiveObjects().forEach((obj) => {
        canvas?.sendBackwards(obj);
      });
      canvas?.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
      save();
    },
    bringToFront: () => {
      canvas?.getActiveObjects().forEach((obj) => {
        canvas?.bringToFront(obj);
      });
      canvas?.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
      save();
    },
    sendToBack: () => {
      canvas?.getActiveObjects().forEach((obj) => {
        canvas?.sendToBack(obj);
      });
      canvas?.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
      save();
    },
    changeFontFamily: (value) => {
      setFontFamily(value);
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ fontFamily: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    changeFontSize: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ fontSize: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    changeTextAlign: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ textAlign: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    changeFontWeight: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ fontWeight: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    changeFontStyle: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ fontStyle: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    changeFontLinethrough: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ linethrough: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    changeFontUnderline: (value) => {
      canvas?.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text") {
          obj.set({ underline: value });
        }
      });
      canvas?.renderAll();
      save();
    },
    duplicate: () => {
      canvas?.getActiveObjects().forEach((obj) => {
        obj.clone((cloned) => {
          cloned.set({
            left: obj.left + 20,
            top: obj.top + 20,
          });
          canvas?.add(cloned);
          canvas?.setActiveObject(cloned);
        });
      });
      canvas?.renderAll();
      save();
    },
    delete: () => {
      canvas?.getActiveObjects().forEach((obj) => {
        canvas?.remove(obj);
      });
      canvas?.discardActiveObject();
      canvas?.renderAll();
      save();
    },
    toggleVisibility: (object) => {
      object.set({ visible: !object.visible });
      canvas?.renderAll();
      save();
    },
    isVisible: (object) => {
      return object.visible;
    },
    copy,
    paste,
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return fillColor;
      return selectedObject.get("fill") || fillColor;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeColor;
      return selectedObject.get("stroke") || strokeColor;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeWidth;
      return selectedObject.get("strokeWidth") || strokeWidth;
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return 1;
      return selectedObject.get("opacity") || 1;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return fontFamily;
      return selectedObject.get("fontFamily") || fontFamily;
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return 32;
      return selectedObject.get("fontSize") || 32;
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return "left";
      return selectedObject.get("textAlign") || "left";
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return 400;
      return selectedObject.get("fontWeight") || 400;
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return "normal";
      return selectedObject.get("fontStyle") || "normal";
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return false;
      return selectedObject.get("linethrough") || false;
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return false;
      return selectedObject.get("underline") || false;
    },
  };
};

export const useEditor = ({ clearSelectionCallback, saveCallback, socket }) => {
  const [canvas, setCanvas] = useState(null);
  const [container, setContainer] = useState(null);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [objects, setObjects] = useState([]);

  const [fillColor, setFillColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontFamily, setFontFamily] = useState("Arial");

  const { save, canUndo, canRedo, undo, redo, setHistoryIndex, canvasHistory } = useHistory({
    canvas,
    saveCallback,
  });

  const { autoResize } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    setObjects,
    clearSelectionCallback,
    save,
    socket,
  });

  // Listen for socket updates
  useEffect(() => {
    if (!socket || !canvas) return;

    socket.on("canvas-update", (data) => {
      canvas.__isSyncing = true;
      
      if (data.type === "added" || data.type === "modified") {
        fabric.util.enlivenObjects([data.object], (enlivenedObjects) => {
          enlivenedObjects.forEach((obj) => {
            const existing = canvas.getObjects().find(o => o.id === obj.id);
            if (existing) {
              // Update existing object properties
              const currentProps = obj.toObject(["id"]);
              existing.set(currentProps);
              existing.setCoords(); // Required for selection/interaction after manual update
            } else {
              // Add new object from another user
              canvas.add(obj);
            }
          });
          canvas.renderAll();
          canvas.__isSyncing = false;
        });
      } else if (data.type === "removed") {
        const existing = canvas.getObjects().find(o => (o.id || o.name) === data.objectId);
        if (existing) {
          canvas.remove(existing);
        }
        canvas.renderAll();
        canvas.__isSyncing = false;
      }
    });

    return () => {
      socket.off("canvas-update");
    };
  }, [socket, canvas]);

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
        objects,
        setObjects,
        fontFamily,
        setFontFamily,
        autoResize,
        save,
        undo,
        redo,
        canUndo,
        canRedo,
      });
    }

    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    objects,
    fontFamily,
    autoResize,
    save,
    undo,
    redo,
    canUndo,
    canRedo,
  ]);

  const init = useCallback(({ initialCanvas, initialContainer }) => {
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (additionalProperties) {
        return toObject.call(this, ["id"].concat(additionalProperties));
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.set({
      cornerColor: "#FFF",
      cornerStyle: "circle",
      borderColor: "#3b82f6",
      borderScaleFactor: 1.5,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: "#3b82f6",
    });

    const initialWorkspace = new fabric.Rect({
      width: 900,
      height: 1200,
      name: "clip",
      id: "workspace",
      fill: "white",
      selectable: false,
      hasControls: false,
      evented: false, // Prevents blocking events for objects underneath
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.8)",
        blur: 5,
      }),
    });

    initialCanvas.setWidth(initialContainer.offsetWidth);
    initialCanvas.setHeight(initialContainer.offsetHeight);

    initialCanvas.selection = true;
    initialCanvas.defaultCursor = "default";

    initialCanvas.add(initialWorkspace);
    initialCanvas.centerObject(initialWorkspace);

    setCanvas(initialCanvas);
    setContainer(initialContainer);

    const currentState = JSON.stringify(initialCanvas.toJSON(JSON_PROPERTIES));
    canvasHistory.current = [currentState];
    setHistoryIndex(0);
  }, [canvasHistory, setHistoryIndex]);

  return { init, editor };
};
