/**
 * The site's section index. Nav links and the numbered section headings
 * both read this, so the numbering can never drift out of sync.
 */
export const sections = [
  { id: "work", number: "01", label: "Work", heading: "Selected work" },
  { id: "about", number: "02", label: "About", heading: "About" },
  { id: "experience", number: "03", label: "Experience", heading: "Experience" },
  { id: "skills", number: "04", label: "Skills", heading: "Toolkit" },
  { id: "contact", number: "05", label: "Contact", heading: "Let's talk" },
  { id: "hire", number: "06", label: "Hire me", heading: "Hire me" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const section = (id: SectionId) => sections.find((s) => s.id === id)!;
