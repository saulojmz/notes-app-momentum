import { site } from "@/content/site";

/** The studio wordmark: a soft, wonky italic “proof” with a rising-loaf dot. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display wonk inline-flex items-baseline italic ${className}`}>
      {site.wordmark}
      <svg
        viewBox="0 0 20 12"
        aria-hidden="true"
        className="ml-[0.06em] inline-block h-[0.32em] w-[0.53em] -translate-y-[0.02em] text-terracotta"
      >
        <path d="M1 11.5C1 5.7 5.2 1 10 1s9 4.7 9 10.5Z" fill="currentColor" />
      </svg>
    </span>
  );
}
