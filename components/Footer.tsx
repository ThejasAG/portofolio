import { profile, isPlaceholder } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  const name = isPlaceholder(profile.name) ? profile.initials : profile.name;

  return (
    <footer className="px-6 pb-8 sm:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8">
        <p className="text-meta">
          © {year} {name}
        </p>
        <p className="text-meta">{profile.location}</p>
      </div>
    </footer>
  );
}
