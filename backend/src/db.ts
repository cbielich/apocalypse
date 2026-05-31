import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config';

fs.mkdirSync(config.dataDir, { recursive: true });

export const db = new Database(path.join(config.dataDir, 'apocalypse.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS counts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    ts           INTEGER NOT NULL,
    count        INTEGER NOT NULL,
    hour_of_week INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_counts_how ON counts(hour_of_week);
  CREATE INDEX IF NOT EXISTS idx_counts_ts  ON counts(ts);

  CREATE TABLE IF NOT EXISTS subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  );
`);
