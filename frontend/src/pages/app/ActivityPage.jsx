import React, { useEffect, useState } from "react";
import { fetchActivity } from "../../services/designService";
import Card from "../../Components/ui/Card";
import EmptyState from "../../Components/ui/EmptyState";
import Skeleton from "../../Components/ui/Skeleton";

export default function ActivityPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchActivity();
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Activity Logs</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Track design operations and workspace events in chronological order.
        </p>
      </Card>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-14 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="As your team edits designs, activity history will be listed here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between p-4">
              <p className="text-sm text-[var(--text-primary)]">{item.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{new Date(item.timestamp).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

