import React, { useRef, useEffect, useCallback, useState } from "react";
import { fabric } from "fabric";
import { useEditor } from "../hooks/canvas/use-editor";
import { useSocket } from "../hooks/canvas/use-socket";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightInspector from "./RightInspector";
import FloatingToolbar from "./FloatingToolbar";
import ContextualToolbar from "./ContextualToolbar";
import { useToast } from "../Components/ToastProvider";
import axiosInstance from "../utils/axiosinstance";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuthUser } from "../hooks/useAuthUser";
import { createDesign, updateDesign, setSelectedDesign } from "../store/designSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const uid = () =>
  `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export default function Editor() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { pushToast } = useToast();
  const query = useQuery();
  const dispatch = useDispatch();
  const { user } = useAuthUser();
  const { id: designId } = useParams(); 
  const templateId = query.get("templateId");
  const selectedDesign = useSelector((state) => state.designs.selected);
  const loadedId = useRef(null);

  const { socket, isConnected } = useSocket(designId || templateId || "default");

  const onSave = useCallback((data) => {
    console.log("Canvas changed:", data);
  }, []);

  const { init, editor } = useEditor({
    saveCallback: onSave,
    socket,
  });

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  // Handle Template/Design Loading
  useEffect(() => {
    if (!editor) return;

    const currentId = templateId || selectedDesign?._id;
    if (loadedId.current === currentId) return;

    if (templateId) {
      axiosInstance.get(`/api/templates/${templateId}`)
        .then(res => {
          const template = res.data?.data || res.data;
          if (template.json) {
            editor.loadJson(template.json);
            loadedId.current = templateId;
          } else if (Array.isArray(template.shapes || template.Shapes)) {
            const shapes = template.shapes || template.Shapes;
            editor.loadJson({ objects: shapes });
            loadedId.current = templateId;
          }
        })
        .catch(e => {
          console.error("Failed to load template", e);
        });
    } else if (selectedDesign) {
      if (selectedDesign.json) {
        editor.loadJson(selectedDesign.json);
        loadedId.current = selectedDesign._id;
      } else if (Array.isArray(selectedDesign.Shapes || selectedDesign.shapes)) {
        const shapes = selectedDesign.Shapes || selectedDesign.shapes;
        editor.loadJson({ objects: shapes });
        loadedId.current = selectedDesign._id;
      }
    }
  }, [templateId, selectedDesign, editor]);

  const [designName, setDesignName] = useState(selectedDesign?.name || "Untitled Design");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedDesign?.name) {
      setDesignName(selectedDesign.name);
    }
  }, [selectedDesign]);

  const handleSave = async () => {
    if (!editor || !user) {
      pushToast("Please login to save your design", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const shapes = editor.canvas.getObjects()
        .filter(obj => obj.name !== "clip")
        .map(obj => obj.toObject());

      const json = JSON.stringify(editor.canvas.toJSON([
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
      ]));
      
      const payload = {
        name: designName,
        Shapes: shapes,
        json: json,
        createdBy: user._id,
        username: user.username || user.email,
      };

      // If we are currently editing a "Starter" template or a shared template, 
      // we must CREATE a new design for this user.
      const isStarterTemplate = selectedDesign?.isStarter;
      const isFromTemplateId = !!templateId;

      if (selectedDesign?._id && !isStarterTemplate && !isFromTemplateId) {
        await dispatch(updateDesign({ id: selectedDesign._id, data: payload })).unwrap();
        pushToast("Design updated successfully", "success");
      } else {
        const result = await dispatch(createDesign(payload)).unwrap();
        dispatch(setSelectedDesign(result));
        // Update URL to remove templateId and add designId if needed, or just clear templateId
        window.history.replaceState({}, "", `/editor`); 
        pushToast("Design created successfully", "success");
      }
    } catch (e) {
      console.error(e);
      pushToast(e.message || "Failed to save design", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!editor) return;

    const itemType = e.dataTransfer.getData("itemType");
    if (!itemType) return;

    const itemData = e.dataTransfer.getData("itemData");
    const pointer = editor.canvas.getPointer(e);
    const pos = { x: pointer.x, y: pointer.y };

    switch (itemType) {
      case "rect":
        editor.addRectangle({ left: pos.x, top: pos.y });
        break;
      case "soft-rect":
        editor.addSoftRectangle({ left: pos.x, top: pos.y });
        break;
      case "circle":
        editor.addCircle({ left: pos.x, top: pos.y });
        break;
      case "triangle":
        editor.addTriangle({ left: pos.x, top: pos.y });
        break;
      case "text":
        editor.addText(itemData || "New Text", { left: pos.x, top: pos.y });
        break;
      case "diamond":
        editor.addDiamond({ left: pos.x, top: pos.y });
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <TopBar 
        editor={editor} 
        onSave={handleSave} 
        isSaving={isSaving} 
        designName={designName}
        setDesignName={setDesignName}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar editor={editor} />
        
        <main className="flex-1 relative flex flex-col overflow-hidden">
          {/* Connection Status */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
              {isConnected ? "Live Collaboration" : "Offline"}
            </span>
          </div>

          <div 
            ref={containerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center"
          >
            <canvas ref={canvasRef} />
            
            {editor && (
              <>
                <ContextualToolbar editor={editor} />
                <FloatingToolbar editor={editor} />
              </>
            )}
          </div>
          
          {/* Footer/Zoom Controls could go here */}
        </main>

        <RightInspector editor={editor} />
      </div>
    </div>
  );
}
