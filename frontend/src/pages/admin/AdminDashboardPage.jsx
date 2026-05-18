import React, { useEffect, useMemo, useState } from "react";
import { fetchAdminDesigns, deleteAdminDesign } from "../../services/adminService";
import { useToast } from "../../Components/feedback/ToastProvider";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import EmptyState from "../../Components/ui/EmptyState";

export default function AdminDashboardPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDesigns();
      setDesigns(data);
    } catch {
      setDesigns([]);
      pushToast("Failed to fetch admin designs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const stats = useMemo(
    () => ({
      total: designs.length,
      withThumb: designs.filter((design) => design.thumbnailUrl).length,
    }),
    [designs]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Total assets</p>
          <p className="mt-1 text-3xl font-semibold text-[var(--text-primary)]">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">With preview</p>
          <p className="mt-1 text-3xl font-semibold text-[var(--text-primary)]">{stats.withThumb}</p>
        </Card>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-56 w-full" />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <EmptyState title="No designs found" description="New uploads will appear in the admin catalog." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {designs.map((design) => (
            <Card key={design._id} className="space-y-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{design.name}</h3>
              <p className="text-sm text-[var(--text-secondary)]">By {design.username || "Unknown"}</p>
              {design.thumbnailUrl ? (
                <img
                  src={design.thumbnailUrl}
                  alt={design.name}
                  className="aspect-video w-full rounded-2xl border border-[var(--border)] object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid aspect-video place-items-center rounded-2xl bg-[var(--surface-subtle)] text-sm text-[var(--text-muted)]">
                  No preview
                </div>
              )}
              <Button
                className="w-full"
                variant="danger"
                onClick={async () => {
                  try {
                    await deleteAdminDesign(design._id);
                    pushToast("Design deleted", "success");
                    loadDesigns();
                  } catch {
                    pushToast("Failed to delete design", "error");
                  }
                }}
              >
                Delete design
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

