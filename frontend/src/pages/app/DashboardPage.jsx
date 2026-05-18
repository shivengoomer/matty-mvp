import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDesigns, setSelectedDesign } from "../../store/designSlice";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useToast } from "../../Components/feedback/ToastProvider";
import Card from "../../Components/ui/Card";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import EmptyState from "../../Components/ui/EmptyState";
import Skeleton from "../../Components/ui/Skeleton";
import Badge from "../../Components/ui/Badge";
import MiniBarChart from "../../Components/charts/MiniBarChart";
import DesignCard from "../../Components/system/DesignCard";

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { user } = useAuthUser();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const { list: designs = [], status, error, meta } = useSelector((state) => state.designs || {});

  const refetch = () => {
    if (user?._id) dispatch(fetchDesigns({ userId: user._id, search: query }));
  };

  useEffect(() => {
    refetch();
  }, [query, user?._id]);

  useEffect(() => {
    if (status === "failed" && error) {
      pushToast(error?.message || "Failed to fetch designs", "error");
    }
  }, [status, error, pushToast]);

  const activityData = useMemo(() => {
    const byDay = Array.from({ length: 7 }).map(() => 0);
    designs.forEach((design) => {
      const d = new Date(design.updatedAt || design.createdAt);
      const day = d.getDay();
      byDay[day] += 1;
    });
    return byDay;
  }, [designs]);

  if (status === "loading") return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="xl:col-span-1">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Total designs</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{meta?.total || designs.length}</h2>
        </Card>
        <Card className="xl:col-span-1">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Saved this week</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
            {activityData.reduce((sum, val) => sum + val, 0)}
          </h2>
        </Card>
        <Card className="md:col-span-2 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">Weekly activity</p>
            <Badge tone="success">Live</Badge>
          </div>
          <MiniBarChart values={activityData} />
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">My Designs</h1>
            <p className="text-sm text-[var(--text-secondary)]">Create, revise, and publish visual assets.</p>
          </div>
          <form
            className="flex w-full max-w-md items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(search.trim());
            }}
          >
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name"
              aria-label="Search designs"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </div>

        {designs.length === 0 ? (
          <EmptyState
            title="No designs yet"
            description="Create your first design in the editor and it will appear here."
            actionLabel="Open editor"
            onAction={() => navigate("/editor")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {designs.map((design) => (
              <DesignCard
                key={design._id}
                design={design}
                onRefresh={refetch}
                onOpen={() => {
                  dispatch(setSelectedDesign(design));
                  navigate("/editor");
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

