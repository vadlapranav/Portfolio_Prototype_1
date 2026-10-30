import process from 'node:process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { memeCatalog } from '../src/data/memeCatalog.js';
import { soundCatalog } from '../src/data/soundCatalog.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const base=process.argv[2]||'http://127.0.0.1:5174';
const assets=[...memeCatalog.map(asset=>({id:asset.id,route:asset.file.startsWith('file:')?'/'+path.relative(root,fileURLToPath(asset.file)).replaceAll('\\','/'):asset.file})),...Object.entries(soundCatalog).filter(([,sound])=>sound.file).map(([id,sound])=>({id,route:sound.file})),{id:'resume',route:'/assets/resume.pdf'}];
const results=await Promise.all(assets.map(async asset=>{
  const response=await fetch(new URL(asset.route,base));
  const served=new Uint8Array(await response.arrayBuffer());
  const source=await readFile(path.join(root,asset.route.startsWith('/assets/')?'public':'',asset.route));
  const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
  if(!response.ok||hash(served)!==hash(source))throw new Error(`${asset.id}: missing, changed, or received an HTML fallback`);
  return {id:asset.id,status:response.status,bytes:served.length,type:response.headers.get('content-type')};
}));
console.log(JSON.stringify({checked:results.length,results},null,2));
