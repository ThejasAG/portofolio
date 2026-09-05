import MaskReveal from "./MaskReveal";

/**
 * Numbered section header — part of the site's visual language:
 * hairline rule, mono metadata, oversized title revealed behind a mask.
 */
export default function SectionHeading({
  number,
  title,
  aside,
}: {
  number: string;
  title: string;
  aside?: string;
}) {
  return (
    <header className="border-t border-[var(--color-line)] pt-6">
      <div className="flex items-baseline justify-between gap-6">
        <span className="text-meta">
          {number} — {title}
        </span>
        {aside && (
          <span className="text-meta hidden sm:block text-right">{aside}</span>
        )}
      </div>

      <h2 className="text-section mt-10 sm:mt-14">
        <MaskReveal>{title}</MaskReveal>
      </h2>
    </header>
  );
}
