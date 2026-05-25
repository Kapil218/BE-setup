#!/usr/bin/env node

import {
  access,
  copyFile,
  cp,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateRoot = path.resolve(__dirname, "..");
const targetArg = process.argv[2];
const targetDir = path.resolve(process.cwd(), targetArg ?? ".");
const targetName = path.basename(targetDir);

const excludedEntries = new Set([
  ".git",
  "bin",
  "coverage",
  "dist",
  "node_modules",
  "package-lock.json",
]);

function toPackageName(value) {
  const normalizedName = value
    .replace(/^[._]+/, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedName || "nodebe-app";
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isDirectoryEmpty(directoryPath) {
  const entries = await readdir(directoryPath);
  return entries.length === 0;
}

async function copyTemplateEntry(entryName) {
  const sourcePath = path.join(templateRoot, entryName);
  const destinationPath = path.join(targetDir, entryName);

  if (sourcePath === targetDir) {
    return;
  }

  const sourceStats = await stat(sourcePath);

  if (sourceStats.isDirectory()) {
    await cp(sourcePath, destinationPath, { recursive: true });
    return;
  }

  await copyFile(sourcePath, destinationPath);
}

async function updatePackageJson() {
  const packageJsonPath = path.join(targetDir, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

  packageJson.name = toPackageName(targetName);
  delete packageJson.publishConfig;

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function run() {
  if (await pathExists(targetDir)) {
    const targetStats = await stat(targetDir);

    if (!targetStats.isDirectory()) {
      throw new Error(
        `Target path exists and is not a directory: ${targetDir}`,
      );
    }

    if (!(await isDirectoryEmpty(targetDir))) {
      throw new Error(`Target directory is not empty: ${targetDir}`);
    }
  } else {
    await mkdir(targetDir, { recursive: true });
  }

  const entries = await readdir(templateRoot);

  for (const entryName of entries) {
    if (excludedEntries.has(entryName)) {
      continue;
    }

    await copyTemplateEntry(entryName);
  }

  await updatePackageJson();

  process.stdout.write(`Created a new NodeBE starter in ${targetDir}\n`);
  process.stdout.write("Next steps:\n");
  process.stdout.write(`  cd ${targetArg ?? "."}\n`);
  process.stdout.write("  npm install\n");
  process.stdout.write("  npm run dev\n");
}

run().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
