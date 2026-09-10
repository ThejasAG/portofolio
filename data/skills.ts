export type SkillGroup = {
  category: string;
  /** Only technologies you actually use. Delete groups that don't apply. */
  items: string[];
};

/**
 * Every entry below appears in code you authored — the AgriEco backend, the
 * test orchestration platform, the Medical Voice Bot, or this portfolio.
 * Nothing is listed because it is "expected" for the role.
 */
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    category: "Backend",
    items: ["FastAPI", "SQLAlchemy", "Alembic", "Pydantic", "REST APIs", "JWT / OAuth2"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis", "Schema design", "Migrations"],
  },
  {
    category: "Testing & automation",
    items: [
      "Appium",
      "Selenium",
      "pytest",
      "Real-device testing",
      "Regression testing",
      "API validation",
      "Debugging",
    ],
  },
  {
    category: "AI / ML",
    items: ["scikit-learn", "NLTK", "pandas", "NumPy"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vite", "Tailwind CSS"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Docker", "Uvicorn", "AI-assisted development"],
  },
];
