import { Router } from 'express';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currentFile = path.basename(__filename);

const router = Router();

function getFilesFromRoute() {
  return fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== currentFile &&
      (file.endsWith('.ts') || file.endsWith('.js'))
    );
  });
}

const files = getFilesFromRoute();

async function addFilesInTheRouter(files: string[]) {
  for (const file of files) {
    const routeModule = await import(`./${file}`);
    const baseUrl = routeModule.default.baseUrl;
    const routerOfFile = routeModule.default.router;

    if (!baseUrl || !routerOfFile) {
      throw new Error(`Arquivo ${file} não exporta baseUrl e router`);
    }

    router.use(baseUrl, routerOfFile);
  }
}
await addFilesInTheRouter(files);

export default router;
