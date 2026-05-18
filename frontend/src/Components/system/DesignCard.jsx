import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { renameDesign, removeDesign } from "../../services/designService";
import { useToast } from "../feedback/ToastProvider";

function DesignCard({ design, onRefresh, onOpen }) {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(design.name || "Untitled");
  const imageSrc = design.thumbnailUrl || design.assetUrl || design.thumbnail || "";

  const handleRename = async (event) => {
    event.stopPropagation();
    try {
      await renameDesign(design._id, name.trim() || "Untitled");
      pushToast("Design renamed", "success");
      setEditing(false);
      onRefresh();
    } catch {
      pushToast("Failed to rename design", "error");
    }
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    try {
      await removeDesign(design._id);
      pushToast("Design removed", "success");
      onRefresh();
    } catch {
      pushToast("Failed to remove design", "error");
    }
  };

  return (
    <Card className="group cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard)]" onClick={onOpen}>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]">
        {imageSrc ? (
          <img src={imageSrc} alt={design.name} className="aspect-video w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid aspect-video place-items-center text-sm text-[var(--text-muted)]">No preview</div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          {editing ? (
            <Input value={name} onChange={(event) => setName(event.target.value)} onClick={(event) => event.stopPropagation()} />
          ) : (
            <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">{design.name || "Untitled"}</h3>
          )}
          <p className="text-xs text-[var(--text-muted)]">
            Updated {new Date(design.updatedAt || design.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editing ? (
            <Button size="sm" onClick={handleRename}>
              Save
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={(event) => {
                event.stopPropagation();
                setEditing(true);
              }}
            >
              <PenLine size={14} className="mr-1" />
              Rename
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={(event) => {
              event.stopPropagation();
              navigate("/editor");
            }}
          >
            Open
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default React.memo(DesignCard);

