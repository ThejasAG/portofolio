export type SkillGroup = {
  category: string;
  /** Only technologies you actually use. Delete groups that don't apply. */
  items: string[];
};

/**
 * Deliberately short. These are the tools Thejas actually works in, not
 * every dependency that appears in a package file.
 */
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    category: "Development",
    items: ["React", "React Native", "Next.js", "FastAPI", "Flask"],
  },
  {
    category: "Testing & automation",
    items: ["Appium", "Selenium", "pytest", "API testing", "Real-device testing"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "MySQL", "SQLAlchemy", "Alembic"],
  },
  {
    category: "AI / ML",
    items: ["scikit-learn", "NLTK", "pandas"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Docker"],
  },
];
