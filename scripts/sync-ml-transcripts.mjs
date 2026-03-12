import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(
  ROOT,
  "scratch_pad",
  "transcripts",
  "machine_learning",
  "supervised_learning_algorithms"
);
const DEST_DIR = path.join(
  ROOT,
  "content",
  "transcripts",
  "machine_learning",
  "supervised_learning_algorithms"
);

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${path.relative(ROOT, SOURCE_DIR)}`);
    process.exit(1);
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });
  const files = fs.readdirSync(SOURCE_DIR).filter((name) => name.endsWith(".txt"));

  for (const fileName of files) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const destinationPath = path.join(DEST_DIR, fileName);
    fs.copyFileSync(sourcePath, destinationPath);
  }

  console.log(`Copied ${files.length} ML transcript files to ${path.relative(ROOT, DEST_DIR)}.`);
}

main();
