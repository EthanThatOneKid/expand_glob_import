import type { ExpandGlobOptions } from "@std/fs";
import { expandGlob } from "@std/fs";
import { toFileUrl } from "@std/path";

/**
 * expandGlobImportToMap imports modules from a glob and returns a Map.
 */
export function expandGlobImportToMap(
  glob: string | URL,
  options: ExpandGlobOptions,
): Promise<Map<string, unknown>> {
  return fromAsync(expandGlobImport(glob, options));
}

/**
 * fromAsync converts an AsyncGenerator<[string, T]> to a
 * Promise<Map<string, T>>.
 */
export async function fromAsync<T>(
  generator: AsyncGenerator<[string, T]>,
): Promise<Map<string, T>> {
  const result = new Map<string, T>();
  for await (const [key, value] of generator) {
    result.set(key, value);
  }

  return result;
}

/**
 * expandGlobImport imports modules from a glob.
 */
export async function* expandGlobImport(
  glob: string | URL,
  options: ExpandGlobOptions,
): AsyncGenerator<[string, unknown]> {
  for await (const entry of expandGlob(glob, options)) {
    const module = await import(toFileUrl(entry.path).href);
    for (const [key, value] of Object.entries(module)) {
      // Yield the key and value of the imported module.
      yield [key, value];
    }
  }
}
