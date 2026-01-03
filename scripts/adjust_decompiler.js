import { writeFile, rename, readFile } from "fs/promises";
import { join } from "path";

const NATIVE_DBS = {
  gta5: {
    downloadUrl: "https://raw.githubusercontent.com/alloc8or/gta5-nativedb-data/master/natives.json",
    decompilerPath: join(
      __dirname,
      "../vendor/script_decompiler/GTA V Script Decompiler/Resources/natives.json",
    )
  },
  rdr2: {
    downloadUrl: "https://raw.githubusercontent.com/alloc8or/rdr3-nativedb-data/master/natives.json",
    decompilerPath: join(
      __dirname,
      "../vendor/script_decompiler/GTA V Script Decompiler/Resources/natives_rdr.json",
    )
  }
}

async function updateNativeDb(downloadUrl, decompilerPath) {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const data = await response.text();
  const tempPath = `${decompilerPath}.tmp`;

  await writeFile(tempPath, data, "utf8");
  await rename(tempPath, decompilerPath);
}

await Promise.all(
  Object.values(NATIVE_DBS).map(db =>
    updateNativeDb(db.downloadUrl, db.decompilerPath)
  )
);

const DECOMPILER_CONFIG_PATH = join(__dirname, "../vendor/script_decompiler/GTA V Script Decompiler/App.config")

async function updateIsRdr2InDecompilerConfig() {
  const xml = await readFile(DECOMPILER_CONFIG_PATH, "utf8");

  const updatedXml = xml.replace(
    /(<setting name="IsRDR2"[\s\S]*?<value>)(True|False)(<\/value>)/i,
    "$1True$3"
  );

  await writeFile(DECOMPILER_CONFIG_PATH, updatedXml, "utf8");
}

const GAME = Bun.argv[2]
if (GAME == "rdr2") await updateIsRdr2InDecompilerConfig()

