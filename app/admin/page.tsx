"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, LogOut, Save } from "lucide-react";
import type { Project } from "@/data/projects";

type Content = {
  name: string;
  initials: string;
  title: string;
  statement: string[];
  status: string | null;
  location: string;
  email: string;
  github: string | null;
  linkedin: string | null;
  resume: string | null;
  seo: {
    siteUrl: string;
    description: string;
    twitter: string | null;
  };
  projects: Project[];
};

const field =
  "mt-2 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-fg)]";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [resumeFile, setResumeFile] = useState<{ name: string; base64: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "projects">("profile");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/content")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load content.");
        return res.json();
      })
      .then((data: Content) => {
        setContent(data);
        setSelectedProject(data.projects[0]?.slug ?? null);
      })
      .catch((error) => setMessage(error.message));
  }, [authenticated]);

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      setPassword("");
      setAuthenticated(true);
    } else {
      const data = await response.json();
      setMessage(data.error || "Login failed.");
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setContent(null);
  }

  function setField<K extends keyof Content>(key: K, value: Content[K]) {
    setContent((current) => (current ? { ...current, [key]: value } : current));
  }

  function setSeoField<K extends keyof Content["seo"]>(
    key: K,
    value: Content["seo"][K]
  ) {
    setContent((current) =>
      current ? { ...current, seo: { ...current.seo, [key]: value } } : current
    );
  }

  function setProjectField<K extends keyof Project>(
    slug: string,
    key: K,
    value: Project[K]
  ) {
    setContent((current) =>
      current
        ? {
            ...current,
            projects: current.projects.map((project) =>
              project.slug === slug ? { ...project, [key]: value } : project
            ),
          }
        : current
    );
  }

  function setStudyField<K extends keyof NonNullable<Project["study"]>>(
    slug: string,
    key: K,
    value: NonNullable<Project["study"]>[K]
  ) {
    setContent((current) =>
      current
        ? {
            ...current,
            projects: current.projects.map((project) =>
              project.slug === slug && project.study
                ? { ...project, study: { ...project.study, [key]: value } }
                : project
            ),
          }
        : current
    );
  }

  async function handleResume(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Resume must be a PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Resume must be smaller than 5 MB.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read the PDF."));
      reader.readAsDataURL(file);
    });
    setResumeFile({ name: file.name, base64: dataUrl.split(",")[1] });
    setMessage("");
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...content,
        resumeUpload: resumeFile,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setContent(data.content);
      setResumeFile(null);
      setMessage("Portfolio updated. A GitHub publish may trigger a new deployment.");
    } else {
      setMessage(data.error || "Could not save.");
    }
    setSaving(false);
  }

  if (authenticated === null) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-sm text-[var(--color-muted)]">Checking access…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <form
          onSubmit={submitLogin}
          className="w-full max-w-sm rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7"
        >
          <p className="text-meta">Private area</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">Portfolio CMS</h1>
          <label className="mt-8 block text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={field}
              autoComplete="current-password"
              required
            />
          </label>
          {message && <p className="mt-4 text-sm text-[var(--color-accent)]">{message}</p>}
          <button
            type="submit"
            className="mt-6 min-h-11 w-full rounded-full bg-[var(--color-fg)] px-5 text-sm font-medium text-[var(--color-bg)]"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-sm text-[var(--color-muted)]">{message || "Loading editor…"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-6">
          <div>
            <p className="text-meta">Portfolio editor</p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight">
              {activeTab === "profile" ? "Edit profile" : "Edit projects"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 text-sm"
            >
              <ArrowLeft size={15} /> Back
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 text-sm"
            >
              <ExternalLink size={15} /> View
            </a>
            <button
              type="button"
              onClick={logout}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-line)]"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="flex gap-2 border-b border-[var(--color-line)] py-4">
          {(["profile", "projects"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`min-h-10 rounded-full px-5 text-sm capitalize ${
                activeTab === tab
                  ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                  : "border border-[var(--color-line)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" ? (
        <div className="grid gap-6 py-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
            <h2 className="text-lg font-medium">Identity</h2>
            <label className="mt-5 block text-sm">Name
              <input className={field} value={content.name} onChange={(e) => setField("name", e.target.value)} />
            </label>
            <label className="mt-5 block text-sm">Initials
              <input className={field} value={content.initials} onChange={(e) => setField("initials", e.target.value)} />
            </label>
            <label className="mt-5 block text-sm">Title
              <input className={field} value={content.title} onChange={(e) => setField("title", e.target.value)} />
            </label>
            <label className="mt-5 block text-sm">Status
              <input className={field} value={content.status || ""} onChange={(e) => setField("status", e.target.value || null)} />
            </label>
            <label className="mt-5 block text-sm">Location
              <input className={field} value={content.location} onChange={(e) => setField("location", e.target.value)} />
            </label>
          </section>

          <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
            <h2 className="text-lg font-medium">Hero statement</h2>
            <label className="mt-5 block text-sm">Three lines
              <textarea
                className={`${field} min-h-36 resize-y`}
                value={content.statement.join("\n")}
                onChange={(event) => setField("statement", event.target.value.split("\n").slice(0, 6))}
              />
            </label>
            <h2 className="mt-8 text-lg font-medium">Resume PDF</h2>
            <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-[var(--color-line)] p-5 text-sm">
              <span className="block font-medium">{resumeFile ? resumeFile.name : "Choose a PDF"}</span>
              <span className="mt-1 block text-[var(--color-muted)]">
                {content.resume ? `Current: ${content.resume}` : "No resume uploaded"}
              </span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(event) => handleResume(event.target.files?.[0])}
              />
            </label>
          </section>

          <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
            <h2 className="text-lg font-medium">Contact and links</h2>
            <label className="mt-5 block text-sm">Email
              <input className={field} value={content.email} onChange={(e) => setField("email", e.target.value)} />
            </label>
            <label className="mt-5 block text-sm">GitHub
              <input className={field} value={content.github || ""} onChange={(e) => setField("github", e.target.value || null)} />
            </label>
            <label className="mt-5 block text-sm">LinkedIn
              <input className={field} value={content.linkedin || ""} onChange={(e) => setField("linkedin", e.target.value || null)} />
            </label>
          </section>

          <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
            <h2 className="text-lg font-medium">SEO</h2>
            <label className="mt-5 block text-sm">Site URL
              <input className={field} value={content.seo.siteUrl} onChange={(e) => setSeoField("siteUrl", e.target.value)} />
            </label>
            <label className="mt-5 block text-sm">Description
              <textarea className={`${field} min-h-28 resize-y`} value={content.seo.description} onChange={(e) => setSeoField("description", e.target.value)} />
            </label>
            <label className="mt-5 block text-sm">Twitter handle
              <input className={field} value={content.seo.twitter || ""} onChange={(e) => setSeoField("twitter", e.target.value || null)} />
            </label>
          </section>
        </div>
        ) : (
          <ProjectsEditor
            projects={content.projects}
            selectedSlug={selectedProject}
            onSelect={setSelectedProject}
            onProjectChange={setProjectField}
            onStudyChange={setStudyField}
          />
        )}

        <footer className="sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur">
          <p className="max-w-xl text-sm text-[var(--color-muted)]">{message || "Changes publish to the portfolio source."}</p>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[var(--color-fg)] px-5 text-sm font-medium text-[var(--color-bg)] disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Saving…" : "Publish"}
          </button>
        </footer>
      </div>
    </main>
  );
}

function ProjectsEditor({
  projects,
  selectedSlug,
  onSelect,
  onProjectChange,
  onStudyChange,
}: {
  projects: Project[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onProjectChange: <K extends keyof Project>(
    slug: string,
    key: K,
    value: Project[K]
  ) => void;
  onStudyChange: <K extends keyof NonNullable<Project["study"]>>(
    slug: string,
    key: K,
    value: NonNullable<Project["study"]>[K]
  ) => void;
}) {
  const project = projects.find((item) => item.slug === selectedSlug);
  if (!project) {
    return <p className="py-12 text-sm text-[var(--color-muted)]">No projects found.</p>;
  }

  const textField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    multiline = false
  ) => (
    <label className="mt-5 block text-sm">
      {label}
      {multiline ? (
        <textarea
          className={`${field} min-h-28 resize-y`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={field}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );

  const listField = (
    label: string,
    value: string[],
    onChange: (value: string[]) => void
  ) =>
    textField(label, value.join("\n"), (text) => onChange(text.split("\n")), true);

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Projects" className="flex flex-col gap-2">
        {projects.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(item.slug)}
            className={`rounded-xl border px-4 py-3 text-left text-sm ${
              item.slug === project.slug
                ? "border-[var(--color-fg)]"
                : "border-[var(--color-line)]"
            }`}
          >
            <span className="block text-meta">{item.number}</span>
            <span className="mt-1 block font-medium">{item.title}</span>
          </button>
        ))}
      </nav>

      <div className="grid gap-6">
        <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
          <p className="text-meta">Project details</p>
          {textField("Title", project.title, (value) => onProjectChange(project.slug, "title", value))}
          {textField("Category", project.category, (value) => onProjectChange(project.slug, "category", value))}
          {textField("Short description", project.description, (value) => onProjectChange(project.slug, "description", value), true)}
          {textField("Project description", project.longDescription, (value) => onProjectChange(project.slug, "longDescription", value), true)}
          {textField("Your role", project.role, (value) => onProjectChange(project.slug, "role", value), true)}
          {listField("Technologies (one per line)", project.technologies, (value) => onProjectChange(project.slug, "technologies", value))}
        </section>

        <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
          <p className="text-meta">Links and appearance</p>
          {textField("GitHub URL", project.github || "", (value) => onProjectChange(project.slug, "github", value || null))}
          {textField("Live project URL", project.live || "", (value) => onProjectChange(project.slug, "live", value || null))}
          {textField("Image path under public/ (example: /projects/app.png)", project.image || "", (value) => onProjectChange(project.slug, "image", value || null))}
          {textField("Background image path under public/", project.imageBack || "", (value) => onProjectChange(project.slug, "imageBack", value || null))}
          {textField("Image description", project.imageAlt, (value) => onProjectChange(project.slug, "imageAlt", value))}
          <label className="mt-5 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(event) => onProjectChange(project.slug, "featured", event.target.checked)}
            />
            Show in featured work
          </label>
          {project.study && (
            <label className="mt-5 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={project.caseStudy}
                onChange={(event) => onProjectChange(project.slug, "caseStudy", event.target.checked)}
              />
              Show case-study link
            </label>
          )}
          <label className="mt-5 block text-sm">
            Card layout
            <select
              className={field}
              value={project.layout}
              onChange={(event) =>
                onProjectChange(project.slug, "layout", event.target.value as Project["layout"])
              }
            >
              <option value="wide">Wide</option>
              <option value="split">Split</option>
              <option value="stack">Stack</option>
            </select>
          </label>
        </section>

        {project.study && (
          <section className="rounded-3xl border border-[var(--color-line)] p-5 sm:p-7">
            <p className="text-meta">Case study copy</p>
            {textField("Overview", project.study.overview, (value) => onStudyChange(project.slug, "overview", value), true)}
            {textField("Problem", project.study.problem, (value) => onStudyChange(project.slug, "problem", value), true)}
            {textField("Context", project.study.context, (value) => onStudyChange(project.slug, "context", value), true)}
            {textField("Role", project.study.role, (value) => onStudyChange(project.slug, "role", value), true)}
            {listField("Approach (one per line)", project.study.approach, (value) => onStudyChange(project.slug, "approach", value))}
            {listField("Implementation (one per line)", project.study.implementation, (value) => onStudyChange(project.slug, "implementation", value))}
            {listField("Challenges (one per line)", project.study.challenges, (value) => onStudyChange(project.slug, "challenges", value))}
            {listField("Testing and validation (one per line)", project.study.validation, (value) => onStudyChange(project.slug, "validation", value))}
            {textField("Result", project.study.result, (value) => onStudyChange(project.slug, "result", value), true)}
            {listField("Lessons (one per line)", project.study.lessons, (value) => onStudyChange(project.slug, "lessons", value))}
          </section>
        )}
      </div>
    </div>
  );
}
