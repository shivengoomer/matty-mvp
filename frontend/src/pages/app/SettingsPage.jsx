import React, { useState } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import Card from "../../Components/ui/Card";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { useToast } from "../../Components/feedback/ToastProvider";

export default function SettingsPage() {
  const { user } = useAuthUser();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [preferences, setPreferences] = useState({
    compact: false,
    emailUpdates: true,
  });

  const saveProfile = () => pushToast("Profile settings saved", "success");
  const savePreferences = () => pushToast("Preferences updated", "success");

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Profile</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Update your account details.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-[var(--text-secondary)]">
            Username
            <Input
              value={profile.username}
              onChange={(event) => setProfile((prev) => ({ ...prev, username: event.target.value }))}
            />
          </label>
          <label className="space-y-2 text-sm text-[var(--text-secondary)]">
            Email
            <Input
              type="email"
              value={profile.email}
              onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>
          <label className="space-y-2 text-sm text-[var(--text-secondary)] sm:col-span-2">
            Timezone
            <Input
              value={profile.timezone}
              onChange={(event) => setProfile((prev) => ({ ...prev, timezone: event.target.value }))}
            />
          </label>
        </div>
        <Button className="mt-5" onClick={saveProfile}>
          Save profile
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Preferences</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-2xl bg-[var(--surface-subtle)] p-3 text-sm">
            Compact layout
            <input
              type="checkbox"
              checked={preferences.compact}
              onChange={(event) => setPreferences((prev) => ({ ...prev, compact: event.target.checked }))}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl bg-[var(--surface-subtle)] p-3 text-sm">
            Email updates
            <input
              type="checkbox"
              checked={preferences.emailUpdates}
              onChange={(event) => setPreferences((prev) => ({ ...prev, emailUpdates: event.target.checked }))}
              className="h-4 w-4"
            />
          </label>
        </div>
        <Button className="mt-4 w-full" variant="secondary" onClick={savePreferences}>
          Save preferences
        </Button>
      </Card>
    </div>
  );
}

