// Velmora Statistics — the program that hands this entry in.
//
// Node 22, standard library only. It copies the site's static files (app/)
// and the maker's screenshots (screenshots/) from beside this file into
// /output — or MAKEFUN_OUTPUT_DIR when run outside the grader — and writes
// /output/dossier.json with the kit's buildDossier library, so the judge
// reads exactly the files in this repository. Nothing is installed, nothing
// is fetched, nothing leaves the machine.
//
// Check it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and run it a second time to confirm both runs write the same bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The gate's own caps: the text budget shapes the dossier's bytes, the rest
// refuse an entry the scorer would refuse anyway (more than 4 screenshots
// or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap,
// its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
