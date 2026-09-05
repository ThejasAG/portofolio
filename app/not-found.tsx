import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center px-6 sm:px-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="text-meta">404</p>
        <h1 className="text-display mt-6">Not found</h1>
        <p className="mt-8 max-w-md text-base text-[var(--color-muted)]">
          That page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex min-h-11 items-center gap-2 text-sm"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.75}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span className="link-underline">Back home</span>
        </Link>
      </div>
    </main>
  );
}
