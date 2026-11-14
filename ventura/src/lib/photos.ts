/**
 * Bundled copies of the mock photography (originally Unsplash links, which
 * rot over time and can't load inside sandboxed previews). Look one up by its
 * Unsplash photo id: photo("1541849546-216549ae216d").
 */
const files = import.meta.glob("../assets/photos/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byId = new Map(
  Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(/\.jpg$/, ""), url]),
);

/** Local URL for a bundled photo, or "" when it isn't bundled (callers fall back). */
export const photo = (id: string): string => byId.get(id) ?? "";
