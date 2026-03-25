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

  // Drop existing tables to refresh with seed data
  await db.exec(`
    DROP TABLE IF EXISTS results;
    DROP TABLE IF EXISTS logistics;
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS team;
    DROP TABLE IF EXISTS trials;
    DROP TABLE IF EXISTS registrations;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS admin;
    DROP TABLE IF EXISTS students;
  `);

  console.log('Cleared old tables.');

  // Create tables...
  await db.exec(`
    CREATE TABLE students (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, course TEXT NOT NULL
    );
    CREATE TABLE admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL
    );
    CREATE TABLE events (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, sport TEXT NOT NULL, date TEXT NOT NULL, eligibility TEXT NOT NULL, status TEXT DEFAULT 'pending', image_url TEXT
    );
    CREATE TABLE registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL, event_id INTEGER NOT NULL, status TEXT DEFAULT 'pending', UNIQUE(student_id, event_id), FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(event_id) REFERENCES events(id)
    );
    CREATE TABLE trials (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL, event_id INTEGER NOT NULL, attendance TEXT DEFAULT 'absent', selection_status TEXT DEFAULT 'pending', UNIQUE(student_id, event_id), FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(event_id) REFERENCES events(id)
    );
    CREATE TABLE team (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL, event_id INTEGER NOT NULL, UNIQUE(student_id, event_id), FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(event_id) REFERENCES events(id)
    );
    CREATE TABLE attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL, event_id INTEGER NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL, UNIQUE(student_id, event_id, date), FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(event_id) REFERENCES events(id)
    );
    CREATE TABLE logistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER NOT NULL, total_students INTEGER DEFAULT 0, ground TEXT, rooms INTEGER DEFAULT 0, food_required INTEGER DEFAULT 0, UNIQUE(event_id), FOREIGN KEY(event_id) REFERENCES events(id)
    );
    CREATE TABLE results (
      id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER NOT NULL, winner TEXT, details TEXT, UNIQUE(event_id), FOREIGN KEY(event_id) REFERENCES events(id)
    );
  `);

  console.log('Created new tables. Inserting seed data...');

  // 1. Insert Admins
  await db.exec(`INSERT INTO admin (username, password) VALUES ('admin', 'admin123');`);

  // 2. Insert Students
  const students = [
    { name: 'Aarav Patel', email: 'aarav@cdgi.edu', pass: 'pass123', course: 'B.Tech CS' },
    { name: 'Diya Sharma', email: 'diya@cdgi.edu', pass: 'pass123', course: 'B.Tech IT' },
    { name: 'Kabir Singh', email: 'kabir@cdgi.edu', pass: 'pass123', course: 'MBA' },
    { name: 'Ananya Gupta', email: 'ananya@cdgi.edu', pass: 'pass123', course: 'BBA' },
    { name: 'Vihaan Verma', email: 'vihaan@cdgi.edu', pass: 'pass123', course: 'B.Tech CS' },
  ];
  for (let s of students) {
    await db.run('INSERT INTO students (name, email, password, course) VALUES (?, ?, ?, ?)', [s.name, s.email, s.pass, s.course]);
  }

  // 3. Insert Events
  const events = [
    { name: 'Annual Inter-College Cricket Cup', sport: 'Cricket', date: '2026-04-10', status: 'approved', elig: 'All Undergrads', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600&auto=format&fit=crop' },
    { name: 'CDGI Football League 2026', sport: 'Football', date: '2026-05-15', status: 'approved', elig: 'All Branches', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Summer Basketball Shootout', sport: 'Basketball', date: '2026-06-20', status: 'approved', elig: 'B.Tech Only', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Volleyball Championship', sport: 'Volleyball', date: '2026-07-05', status: 'pending', elig: 'PG & UG', img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1600&auto=format&fit=crop' }
  ];
  
  for (let e of events) {
    const res = await db.run('INSERT INTO events (name, sport, date, status, eligibility, image_url) VALUES (?, ?, ?, ?, ?, ?)', [e.name, e.sport, e.date, e.status, e.elig, e.img]);
    await db.run('INSERT INTO logistics (event_id, total_students, rooms, food_required, ground) VALUES (?, 0, 0, 0, ?)', [res.lastID, e.sport + ' Court 1']);
  }

  // 4. Seed some registrations and trials for Event 1 (Cricket) and Event 2 (Football)
  const regSeed = [
    { s_id: 1, e_id: 1 }, { s_id: 2, e_id: 1 }, { s_id: 3, e_id: 1 },
    { s_id: 4, e_id: 2 }, { s_id: 5, e_id: 2 }
  ];
  
  for (let r of regSeed) {
    await db.run('INSERT INTO registrations (student_id, event_id, status) VALUES (?, ?, ?)', [r.s_id, r.e_id, 'approved']);
    await db.run('INSERT INTO trials (student_id, event_id, attendance, selection_status) VALUES (?, ?, ?, ?)', [r.s_id, r.e_id, 'present', r.s_id % 2 === 1 ? 'selected' : 'pending']);
    
    // Add to team if selected
    if (r.s_id % 2 === 1) {
      await db.run('INSERT INTO team (student_id, event_id) VALUES (?, ?)', [r.s_id, r.e_id]);
    }
    
    // Update logistics
    await db.run(`UPDATE logistics SET total_students = total_students + 1, rooms = CAST((total_students + 1) / 3 AS INTEGER), food_required = total_students + 1 WHERE event_id = ?`, [r.e_id]);
  }

  // 5. Seed a completed event (Past Tournament)
  const pastRes = await db.run('INSERT INTO events (name, sport, date, status, eligibility, image_url) VALUES (?, ?, ?, ?, ?, ?)', ['Winter Cricket Blast 2025', 'Cricket', '2025-12-10', 'completed', 'All', '']);
  await db.run('INSERT INTO results (event_id, winner, details) VALUES (?, ?, ?)', [pastRes.lastID, 'CS Department Vipers', 'Won by 24 runs in a thrilling final match. Man of the Series: Aarav Patel.']);

  console.log('Seed data inserted successfully.');
}

setup().catch(err => {
  console.error('Failed to setup database:', err);
});
