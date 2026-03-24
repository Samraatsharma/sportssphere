import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Define the path to the SQLite DB file
const dbPath = path.join(process.cwd(), 'database', 'sportssphere.db');

export async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}
