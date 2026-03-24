import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database', 'sportssphere.db');

async function setup() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Opened database at', dbPath);

  // students 
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      course TEXT NOT NULL
    )
  `);

  // admin 
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Insert default admin
  await db.exec(`
    INSERT OR IGNORE INTO admin (username, password) VALUES ('admin', 'admin123')
  `);

  // events
  await db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sport TEXT NOT NULL,
      date TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      status TEXT DEFAULT 'pending' 
    )
  `);

  // registrations
  await db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      UNIQUE(student_id, event_id),
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  // trials
  await db.exec(`
    CREATE TABLE IF NOT EXISTS trials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      attendance TEXT DEFAULT 'absent',
      selection_status TEXT DEFAULT 'pending',
      UNIQUE(student_id, event_id),
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  // team
  await db.exec(`
    CREATE TABLE IF NOT EXISTS team (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      UNIQUE(student_id, event_id),
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  // attendance (training attendance)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      UNIQUE(student_id, event_id, date),
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  // logistics
  await db.exec(`
    CREATE TABLE IF NOT EXISTS logistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      total_students INTEGER DEFAULT 0,
      ground TEXT,
      rooms INTEGER DEFAULT 0,
      food_required INTEGER DEFAULT 0,
      UNIQUE(event_id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  // results
  await db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      winner TEXT,
      details TEXT,
      UNIQUE(event_id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  console.log('Database setup complete.');
}

setup().catch(err => {
  console.error('Failed to setup database:', err);
});
