import assert from "assert";
import { spawn } from "child_process";
import { join } from "path";

const SCRIPT_DIRS = ["../vendor/script_rel", "../vendor/script_mp_rel"].map(dir => join(__dirname, dir))
const DECOMPILER_PATH = join(__dirname, "../bin/GTA V Script Decompiler")

SCRIPT_DIRS.forEach(dir => {
  const args = [dir, "-r", "-n"];
  const decompiler = spawn(DECOMPILER_PATH, args);

  decompiler.stdout.pipe(process.stdout);

  decompiler.on("close", code => {
    assert(code == 0)
  })
})
