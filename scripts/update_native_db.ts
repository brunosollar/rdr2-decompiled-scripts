import { writeFile, rename } from "fs/promises";
import { join } from "path";

const NATIVE_DB_URL =
  "https://raw.githubusercontent.com/alloc8or/rdr3-nativedb-data/master/natives.json";
const SCRIPT_COMPILER_NATIVE_DB_PATH = join(
  __dirname,
  "../vendor/script_decompiler/GTA V Script Decompiler/Resources/natives_rdr.json",
);
const TEMP_PATH = SCRIPT_COMPILER_NATIVE_DB_PATH + ".tmp";

async function updateScriptCompilerNativeDb() {
  const response = await fetch(NATIVE_DB_URL);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const data = await response.text();

  await writeFile(TEMP_PATH, data, "utf8");
  await rename(TEMP_PATH, SCRIPT_COMPILER_NATIVE_DB_PATH);
}

await updateScriptCompilerNativeDb();
