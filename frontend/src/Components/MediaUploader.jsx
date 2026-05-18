import React, { useCallback } from "react";
import { useUploadThing } from "../utils/uploadthing";
import { useToast } from "./feedback/ToastProvider";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

export default function MediaUploader({ onUploadComplete, editor, endpoint = "mediaUploader" }) {
  const { pushToast } = useToast();

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const url = res[0].url;
        pushToast("Upload successful", "success");
        onUploadComplete?.(url);
      }
    },
    onUploadError: (error) => {
      pushToast(`Upload failed: ${error.message}`, "error");
    },
  });

  const onFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Optimistic background upload flow
    for (const file of files) {
      // 1. Create a local preview URL
      const localUrl = URL.createObjectURL(file);

      // 2. Immediately add to editor with a "loading" state indicator if possible
      // For now, we add it directly. We can improve this by tagging it.
      if (editor) {
        const imageId = `uploading_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
        
        editor.addImage(localUrl, {
          id: imageId,
          opacity: 0.5, // Visual cue that it's uploading
        });

        // 3. Start background upload
        startUpload([file]).then((res) => {
          if (res && res.length > 0) {
            const permanentUrl = res[0].url;
            
            // 4. Update the image in the canvas with the permanent URL
            const canvas = editor.canvas;
            const objects = canvas.getObjects();
            const imgObj = objects.find(obj => obj.id === imageId);
            
            if (imgObj) {
              imgObj.setSrc(permanentUrl, () => {
                imgObj.set({ opacity: 1, id: `o_${Date.now()}` }); // Reset opacity and set final ID
                canvas.renderAll();
                // Revoke local URL to free memory
                URL.revokeObjectURL(localUrl);
              }, { crossOrigin: "anonymous" });
            }
          }
        });
      }
    }
  }, [editor, startUpload]);

  return (
    <div className="space-y-4">
      <label className="relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-all group overflow-hidden">
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          multiple
          onChange={onFileChange}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
          )}
          <p className="mb-2 text-sm text-gray-500 font-semibold uppercase tracking-tight">
            {isUploading ? "Uploading..." : "Click to upload"}
          </p>
          <p className="text-[10px] text-gray-400 uppercase font-bold">PNG, JPG or SVG</p>
        </div>
      </label>

      {/* Quick Tips or Status */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50/50 rounded-lg border border-blue-100/50">
        <ImageIcon size={12} className="text-blue-500" />
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
          Images appear instantly in editor
        </span>
      </div>
    </div>
  );
}
