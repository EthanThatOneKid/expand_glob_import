import type { ExpandGlobOptions } from "@std/fs";
import { expandGlob } from "@std/fs";
import { toFileUrl } from "@std/path";

/**
 * expandGlobImport imports modules from a glob.
 */
export async function expandGlobImport(
  glob: string | URL,
  options: ExpandGlobOptions,
) {
  // deno-lint-ignore no-explicit-any
  const modules = new Map<string, any>();
  for await (const entry of expandGlob(glob, options)) {
    const module = await import(toFileUrl(entry.path).href);
    for (const [key, value] of Object.entries(module)) {
      modules.set(key, value);
    }
  }

  return modules;
}
