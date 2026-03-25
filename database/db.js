import { Pool } from 'pg';

let _pool = null;

function getPool() {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL is missing. Please set it in your environment. (Vercel will inject this automatically if using Vercel Postgres)');
    }
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Render, Neon, Supabase, and Vercel all require SSL for remote edge connections.
      ssl: { rejectUnauthorized: false }
    });
  }
  return _pool;
}

// Convert SQLite '?' binding markers to Postgres '$1, $2, $3' parameters
function convertQuery(text) {
  let i = 1;
  return text.replace(/\?/g, () => `$${i++}`);
}

export async function openDB() {
  const pool = getPool();
  return {
    all: async (text, params = []) => {
      const res = await pool.query(convertQuery(text), params);
      return res.rows;
    },
    get: async (text, params = []) => {
      const res = await pool.query(convertQuery(text), params);
      return res.rows[0];
    },
    run: async (text, params = []) => {
      let q = convertQuery(text);
      let isInsert = q.trim().toUpperCase().startsWith('INSERT');
      
      // Emulate SQLite's response format: { lastID: X, changes: Y }
      // Postgres does not automatically return IDs on INSERT unless RETURNING is appended.
      if (isInsert && !q.toUpperCase().includes('RETURNING')) {
         q += ' RETURNING id';
      }

      try {
        const res = await pool.query(q, params);
        return { 
          lastID: isInsert && res.rows.length > 0 ? res.rows[0].id : null, 
          changes: res.rowCount 
        };
      } catch (err) {
        console.error('DB Run Error:', err.message, '| Query:', q, '| Params:', params);
        throw err;
      }
    },
    exec: async (text) => {
      // Direct raw query execution for DDL batches
      return await pool.query(text);
    }
  };
}
