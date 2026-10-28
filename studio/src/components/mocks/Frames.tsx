import type { Project } from "@/content/projects";

export function themeVars(p: Project) {
  return {
    "--p": p.theme.paper,
    "--i": p.theme.ink,
    "--a": p.theme.accent,
    "--a2": p.theme.accent2,
    "--m": p.theme.muted,
  } as React.CSSProperties;
}

/** A quiet browser edge: just enough to read as “a website”, nothing that dates it. */
export function BrowserFrame({
  project,
  children,
  className = "",
}: {
  project: Project;
  children: React.ReactNode;
  className?: string;
}) {
  const domain = project.slug.replace("-", "") + ".com";
  return (
    <div
      className={`mock overflow-hidden bg-[var(--p)] text-[var(--i)] shadow-[0_1px_0_rgb(0_0_0/0.06),0_30px_60px_-30px_rgb(42_28_21/0.45)] ${className}`}
      style={themeVars(project)}
    >
      <div className="flex h-[3.2cqw] items-center gap-[0.8cqw] border-b border-black/10 bg-black/[0.04] px-[1.6cqw]">
        <span className="size-[0.9cqw] rounded-full bg-black/15" />
        <span className="size-[0.9cqw] rounded-full bg-black/15" />
        <span className="mx-auto font-mono text-[1.1cqw] tracking-wide opacity-80">{domain}</span>
      </div>
      <div className="relative aspect-[16/9.4]">{children}</div>
    </div>
  );
}

export function PhoneFrame({
  project,
  children,
  className = "",
}: {
  project: Project;
  children: React.ReactNode;
  className?: string;
}) {
  // The outer element is the size container; the device is drawn inside it so
  // its bezel and corner radius scale with the phone, not with the page.
  return (
    <div className={`mock ${className}`} style={themeVars(project)}>
      <div className="relative aspect-[9/17.6] overflow-hidden rounded-[11cqw] border-[2.2cqw] border-[#1c1512] bg-[var(--p)] text-[var(--i)] shadow-[0_30px_50px_-28px_rgb(42_28_21/0.55)]">
        <div className="absolute left-1/2 top-[2.5cqw] z-10 h-[5.5cqw] w-[26cqw] -translate-x-1/2 rounded-full bg-[#1c1512]" />
        {children}
      </div>
    </div>
  );
}
