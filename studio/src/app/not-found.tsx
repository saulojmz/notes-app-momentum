import Link from "next/link";
import { Arrow } from "@/components/SectionLabel";

export default function NotFound() {
  return (
    <section className="frame flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="label text-cocoa">Error 404</p>
      <h1 className="display mt-6 text-[clamp(3.5rem,11vw,10rem)]">
        Sold out <em className="wonk text-terracotta">early.</em>
      </h1>
      <p className="mt-6 max-w-md text-lg">This page isn’t on the shelf today. The good stuff is back at the counter.</p>
      <Link href="/" className="group label mt-10 inline-flex w-fit items-center gap-3 bg-ink px-6 py-4 text-paper hover:bg-terracotta">
        Back to the homepage <Arrow className="transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
