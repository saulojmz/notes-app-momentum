import { useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Rendered instead of the image when src is empty or fails to load. */
  fallback?: ReactNode;
  /** Classes for the fallback surface. */
  fallbackClassName?: string;
}

/**
 * <img> that never shows a broken-image glyph. Remote mock imagery
 * (Unsplash) disappears over time; this degrades to a quiet tinted panel.
 */
export const SmartImage = ({ src, alt, className, fallback, fallbackClassName, onError, ...props }: SmartImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const failed = !src || failedSrc === src;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-secondary via-muted to-accent text-muted-foreground/50",
          className,
          fallbackClassName,
        )}
      >
        {fallback ?? <ImageOff className="h-6 w-6" strokeWidth={1.5} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        setFailedSrc(src);
        onError?.(e);
      }}
      {...props}
    />
  );
};
