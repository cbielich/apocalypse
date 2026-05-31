import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { config } from '../config';
import { BUSINESS_JET_TYPES } from './types';

const CACHE_FILE = path.join(config.dataDir, 'jet-types.json');
const CSV_FILE = path.join(config.dataDir, 'aircraftDatabase.csv');
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // refresh the registry weekly

export interface JetInfo {
  type: string; // ICAO type designator, e.g. "GLF6"
  model: string; // human model from registry, e.g. "G650" (may be empty)
}

let cachedMap: Map<string, JetInfo> | null = null;

/** Minimal CSV tokenizer that tolerates single- or double-quoted fields. */
function tokenizeCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  let quoteChar = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === quoteChar) {
        if (line[i + 1] === quoteChar) {
          cur += ch;
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"' || ch === "'") {
      inQuotes = true;
      quoteChar = ch;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

async function downloadCsv(): Promise<void> {
  const res = await fetch(config.aircraftDbUrl);
  if (!res.ok || !res.body) {
    throw new Error(`aircraft DB download failed: ${res.status}`);
  }
  await pipeline(
    Readable.fromWeb(res.body as Parameters<typeof Readable.fromWeb>[0]),
    fs.createWriteStream(CSV_FILE),
  );
}

async function buildMapFromCsv(): Promise<Map<string, JetInfo>> {
  const map = new Map<string, JetInfo>();
  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_FILE),
    crlfDelay: Infinity,
  });
  let header: string[] | null = null;
  let icaoIdx = 0;
  let typeIdx = -1;
  let modelIdx = -1;
  for await (const line of rl) {
    if (!line) continue;
    const fields = tokenizeCsvLine(line);
    if (!header) {
      header = fields.map((f) => f.trim().toLowerCase());
      const i = header.indexOf('icao24');
      icaoIdx = i === -1 ? 0 : i;
      typeIdx = header.indexOf('typecode');
      modelIdx = header.indexOf('model');
      continue;
    }
    const icao = (fields[icaoIdx] || '').trim().toLowerCase();
    const type = typeIdx >= 0 ? (fields[typeIdx] || '').trim().toUpperCase() : '';
    const model = modelIdx >= 0 ? (fields[modelIdx] || '').trim() : '';
    if (icao && type && BUSINESS_JET_TYPES.has(type)) {
      map.set(icao, { type, model });
    }
  }
  return map;
}

function readCacheFile(): Map<string, JetInfo> {
  const arr = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) as [
    string,
    string,
    string,
  ][];
  return new Map(arr.map(([icao, type, model]) => [icao, { type, model }]));
}

function writeCacheFile(map: Map<string, JetInfo>): void {
  const arr = [...map].map(([icao, info]) => [icao, info.type, info.model]);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(arr));
}

/**
 * Returns a map of icao24 hex code -> business-jet type/model.
 * Caches to disk and refreshes weekly. On failure, falls back to a stale
 * cache if available, otherwise an empty map (the poller then reports 0).
 */
export async function getJetTypeMap(forceRefresh = false): Promise<Map<string, JetInfo>> {
  if (cachedMap && !forceRefresh) return cachedMap;

  try {
    if (!forceRefresh && fs.existsSync(CACHE_FILE)) {
      const stat = fs.statSync(CACHE_FILE);
      if (Date.now() - stat.mtimeMs < MAX_AGE_MS) {
        cachedMap = readCacheFile();
        return cachedMap;
      }
    }
  } catch {
    // ignore and rebuild
  }

  try {
    await downloadCsv();
    const map = await buildMapFromCsv();
    writeCacheFile(map);
    cachedMap = map;
    console.log(`[registry] built business-jet set: ${map.size} aircraft`);
    return map;
  } catch (err) {
    console.error('[registry] build failed:', (err as Error).message);
    if (fs.existsSync(CACHE_FILE)) {
      cachedMap = readCacheFile();
      return cachedMap;
    }
    cachedMap = new Map();
    return cachedMap;
  }
}
