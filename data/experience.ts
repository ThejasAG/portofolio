export type Role = {
  company: string;
  role: string;
  /** e.g. "2024 — Present". Absolute dates only, no relative wording. */
  period: string;
  location: string;
  /** 2–4 bullets. Ownership and technical contribution, no invented metrics. */
  points: string[];
  technologies: string[];
};

/**
 * Xorstack is the employer. Vya is a product tested during the internship —
 * not something built here, and not a personal project, so it does not
 * appear in data/projects.ts.
 */
export const experience: Role[] = [
  {
    company: "Xorstack",
    role: "Intern",
    period: "CONTENT_REQUIRED", // absolute dates, e.g. "Jun 2026 — Present"
    location: "CONTENT_REQUIRED",
    points: [
      "Worked on manual testing and validation of the Vya Consumer and Business application workflows, comparing behaviour and output between the two applications rather than checking either in isolation.",
      "Validated invoices and VAT calculations across different rates, and investigated the cases where the two applications disagreed — tracing one to a per-unit value being rounded a step too early.",
      "Ran regression and real-device testing across application workflows, and looked at how far multiple applications and devices could be tested in parallel.",
      "Built and maintained an internal mobile test orchestration platform, including the reliability work that stopped runs reporting results which did not match device behaviour.",
    ],
    technologies: [
      "Manual testing",
      "Regression testing",
      "Real-device testing",
      "Invoice & VAT validation",
      "API validation",
      "Python",
      "FastAPI",
      "Appium",
      "Git",
    ],
  },
];

export const education: Role[] = [
  {
    company: "Dr. Ambedkar Institute of Technology, Bengaluru",
    role: "B.E. — Artificial Intelligence & Machine Learning",
    period: "CONTENT_REQUIRED", // e.g. "2022 — 2026"
    location: "Bengaluru, India",
    points: [],
    technologies: [],
  },
];
