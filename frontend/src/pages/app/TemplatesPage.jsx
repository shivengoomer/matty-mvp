import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTemplates } from "../../services/templateService";
import Card from "../../Components/ui/Card";
import Input from "../../Components/ui/Input";
import Skeleton from "../../Components/ui/Skeleton";
import EmptyState from "../../Components/ui/EmptyState";
import { useDispatch } from "react-redux";
import { setSelectedDesign } from "../../store/designSlice";

export default function TemplatesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchTemplates(category);
        setTemplates(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch templates", err);
        setError("Failed to load templates. Please try again later.");
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [category]);

  const handleTemplateClick = (template) => {
    // If it's a starter template, we store it in Redux so the editor can load the JSON
    // We can also just use templateId if the editor is updated to handle it.
    if (template.isStarter) {
      dispatch(setSelectedDesign(template));
      navigate(`/editor`);
    } else {
      navigate(`/editor?templateId=${template._id}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Templates</h1>
          <p className="text-sm text-[var(--text-secondary)]">Use approved templates to move faster.</p>
        </div>
        <div className="w-full max-w-sm">
          <Input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Filter by category"
            aria-label="Filter templates by category"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} className="h-56 w-full" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Try a different category filter or ask an admin to add templates."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template._id}
              className="cursor-pointer overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard)]"
              onClick={() => handleTemplateClick(template)}
            >
              <div className="aspect-[4/3] bg-[var(--surface-subtle)] relative">
                {template.isStarter && (
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-blue-600 text-[8px] font-black text-white uppercase rounded-md shadow-lg">
                    Featured
                  </div>
                )}
                {template.imageUrl ? (
                  <img src={template.imageUrl} alt={template.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">No image</div>
                )}
              </div>
              <div className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{template.category}</p>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{template.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

