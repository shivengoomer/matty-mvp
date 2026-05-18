import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTemplate } from "../../services/templateService";
import { useToast } from "../../Components/feedback/ToastProvider";
import Card from "../../Components/ui/Card";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

export default function AddTemplatePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onPickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !category || !imageData) {
      pushToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const template = await createTemplate({ name, category, imageData });
      pushToast("Template created", "success");
      navigate(`/editor?templateId=${template._id || ""}`);
    } catch {
      pushToast("Failed to create template", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Add Official Template</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Create reusable template assets for teams.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          Name
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          Category
          <Input value={category} onChange={(event) => setCategory(event.target.value)} required />
        </label>
        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          Image
          <input
            type="file"
            accept="image/*"
            required
            onChange={onPickImage}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-sm"
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create template"}
        </Button>
      </form>
    </Card>
  );
}

