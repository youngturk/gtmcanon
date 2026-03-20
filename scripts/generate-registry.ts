import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const yaml = readFileSync(
  join(import.meta.dir, "../registry/registry.yaml"),
  "utf-8"
);

const output = `// AUTO-GENERATED — do not edit. Run: bun run generate
export const REGISTRY_YAML = ${JSON.stringify(yaml)};
`;

writeFileSync(
  join(import.meta.dir, "../src/lib/registry-data.ts"),
  output
);

console.log("Generated src/lib/registry-data.ts");
