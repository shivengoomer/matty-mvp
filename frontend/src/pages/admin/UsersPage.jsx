import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../services/adminService";
import { useToast } from "../../Components/feedback/ToastProvider";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import EmptyState from "../../Components/ui/EmptyState";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await fetchUsers());
    } catch {
      setUsers([]);
      pushToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">User Management</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Review and moderate workspace members.</p>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-20 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users" description="Users will appear here when accounts are created." />
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{user.username}</p>
                <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  try {
                    await deleteUser(user._id);
                    pushToast("User deleted", "success");
                    load();
                  } catch {
                    pushToast("Failed to delete user", "error");
                  }
                }}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

