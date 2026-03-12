import fs from "node:fs";
import path from "node:path";
import { topicCodeGuides } from "../data/topicCodeGuides.js";

const ROOT = process.cwd();

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyMappedFiles() {
  const copied = [];
  const missing = [];
  const seenDest = new Set();

  for (const guide of Object.values(topicCodeGuides)) {
    for (const entry of guide.files ?? []) {
      const sourcePath = entry.sourcePath ?? entry.path;
      const destinationPath = entry.path;
      if (!sourcePath || !destinationPath) continue;

      const sourceAbs = path.join(ROOT, sourcePath);
      const destAbs = path.join(ROOT, destinationPath);

      if (!fs.existsSync(sourceAbs)) {
        missing.push(sourcePath);
        continue;
      }

      if (seenDest.has(destAbs)) continue;
      seenDest.add(destAbs);

      ensureDir(path.dirname(destAbs));
      fs.copyFileSync(sourceAbs, destAbs);
      copied.push({
        source: sourcePath,
        destination: destinationPath,
      });
    }
  }

  return { copied, missing };
}

function main() {
  const { copied, missing } = copyMappedFiles();
  console.log(`Copied ${copied.length} mapped code asset files.`);
  if (missing.length > 0) {
    console.log(`Missing ${missing.length} source files:`);
    for (const src of missing) console.log(`- ${src}`);
    process.exitCode = 1;
  }
}

main();
