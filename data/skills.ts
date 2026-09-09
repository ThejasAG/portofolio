export type SkillGroup = {
  category: string;
  /** Only technologies you actually use. Delete groups that don't apply. */
  items: string[];
};

/**
 * Every entry below appears in code you authored in
 * the AgriEco backend (see backend/requirements.txt and the route/database
 * modules), or in this portfolio's own source. Nothing is listed because it
 * is "expected" for the role.
 */
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    category: "Backend",
    items: ["FastAPI", "SQLAlchemy", "Pydantic", "REST APIs", "JWT / OAuth2"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis", "Schema design", "Migrations"],
  },
  {
    category: "Testing & quality",
    items: [
      "pytest",
      "API contract testing",
      "Input validation",
      "Regression testing",
      "Debugging",
    ],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Docker", "Uvicorn", "AI-assisted development"],
  },
];
