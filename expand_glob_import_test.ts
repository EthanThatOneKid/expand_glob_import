import { assertEquals } from "@std/assert";
import { expandGlobImportToMap } from "./expand_glob_import.ts";

Deno.test("expandGlobImport imports modules from a glob", async () => {
  const modules = await expandGlobImportToMap(
    new URL("./fixtures/*.ts", import.meta.url),
    { root: import.meta.url },
  );

  assertEquals(modules.size, 1);
  assertEquals(typeof modules.get("greet"), "function");
});
