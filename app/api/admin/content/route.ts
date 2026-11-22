import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin";

export const runtime = "nodejs";

const contentPath = () => path.join(process.cwd(), "data", "content.json");

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
};

function cleanString(value: unknown, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanNullable(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, 500) : null;
}

function validateContent(body: Record<string, unknown>): Content {
  const statement = Array.isArray(body.statement)
    ? body.statement.map((line) => cleanString(line, 400)).filter(Boolean).slice(0, 6)
    : [];
  const seo =
    body.seo && typeof body.seo === "object"
      ? (body.seo as Record<string, unknown>)
      : {};
  return {
    name: cleanString(body.name, 100),
    initials: cleanString(body.initials, 8),
    title: cleanString(body.title, 160),
    statement,
    status: cleanNullable(body.status),
    location: cleanString(body.location, 160),
    email: cleanString(body.email, 200),
    github: cleanNullable(body.github),
    linkedin: cleanNullable(body.linkedin),
    resume: cleanNullable(body.resume),
    seo: {
      siteUrl: cleanString(seo.siteUrl, 500),
      description: cleanString(seo.description, 500),
      twitter: cleanNullable(seo.twitter),
    },
  };
}

async function githubRequest(pathname: string, token: string, init?: RequestInit) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function publishToGitHub(content: Content, resume: { name: string; base64: string } | null) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return false;

  const ref = await githubRequest(
    `/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`,
    token
  ) as { object: { sha: string } };
  const baseCommit = await githubRequest(
    `/repos/${repo}/git/commits/${ref.object.sha}`,
    token
  ) as { tree: { sha: string } };

  const entries: { path: string; mode: "100644"; type: "blob"; sha: string }[] = [];
  const contentBlob = await githubRequest(`/repos/${repo}/git/blobs`, token, {
    method: "POST",
    body: JSON.stringify({
      content: `${JSON.stringify(content, null, 2)}\n`,
      encoding: "utf-8",
    }),
  }) as { sha: string };
  entries.push({ path: "data/content.json", mode: "100644", type: "blob", sha: contentBlob.sha });

  if (resume) {
    const resumeBlob = await githubRequest(`/repos/${repo}/git/blobs`, token, {
      method: "POST",
      body: JSON.stringify({ content: resume.base64, encoding: "base64" }),
    }) as { sha: string };
    entries.push({ path: "public/resume.pdf", mode: "100644", type: "blob", sha: resumeBlob.sha });
  }

  const tree = await githubRequest(`/repos/${repo}/git/trees`, token, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: entries }),
  }) as { sha: string };
  const commit = await githubRequest(`/repos/${repo}/git/commits`, token, {
    method: "POST",
    body: JSON.stringify({
      message: "Update portfolio content from CMS",
      tree: tree.sha,
      parents: [ref.object.sha],
    }),
  }) as { sha: string };
  await githubRequest(`/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  return true;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  try {
    const content = await fs.readFile(contentPath(), "utf8");
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("admin content: failed to read", error);
    return NextResponse.json({ error: "Could not load portfolio content." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const payload = (body ?? {}) as Record<string, unknown>;
  const content = validateContent(payload);
  if (!content.name || !content.title) {
    return NextResponse.json({ error: "Name and title are required." }, { status: 422 });
  }

  const resumeUpload =
    payload.resumeUpload && typeof payload.resumeUpload === "object"
      ? (payload.resumeUpload as { name?: unknown; base64?: unknown })
      : null;
  let resume: { name: string; base64: string } | null = null;
  if (
    resumeUpload &&
    typeof resumeUpload.name === "string" &&
    typeof resumeUpload.base64 === "string"
  ) {
    if (!resumeUpload.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Resume must be a PDF." }, { status: 422 });
    }
    const bytes = Buffer.from(resumeUpload.base64, "base64");
    if (bytes.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Resume must be smaller than 5 MB." }, { status: 422 });
    }
    resume = { name: resumeUpload.name, base64: resumeUpload.base64 };
  }

  if (resume) content.resume = "/resume.pdf";

  try {
    const published = await publishToGitHub(content, resume);
    if (!published) {
      await fs.writeFile(contentPath(), `${JSON.stringify(content, null, 2)}\n`, "utf8");
      if (resume) {
        await fs.writeFile(
          path.join(process.cwd(), "public", "resume.pdf"),
          Buffer.from(resume.base64, "base64")
        );
      }
    }
  } catch (error) {
    console.error("admin content: publish failed", error);
    return NextResponse.json(
      { error: "Could not publish the changes. Check server logs and GitHub settings." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, content });
}
