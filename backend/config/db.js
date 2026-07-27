import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure db directory and file exist
function initializeDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      audits: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Read database
export function readDb() {
  initializeDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file, resetting...', error);
    const initialData = { users: [], audits: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

// Write database
export function writeDb(data) {
  initializeDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

// User helper methods
export const db = {
  // Users
  getUsers: () => readDb().users,
  getUserById: (id) => readDb().users.find(u => u.id === id),
  getUserByEmail: (email) => readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (user) => {
    const database = readDb();
    database.users.push(user);
    writeDb(database);
    return user;
  },
  updateUser: (id, updates) => {
    const database = readDb();
    const idx = database.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      database.users[idx] = { ...database.users[idx], ...updates };
      writeDb(database);
      return database.users[idx];
    }
    return null;
  },

  // Audits
  getAudits: () => readDb().audits,
  getAuditById: (id) => readDb().audits.find(a => a.id === id),
  getAuditsByUserId: (userId) => readDb().audits.filter(a => a.userId === userId),
  addAudit: (audit) => {
    const database = readDb();
    database.audits.push(audit);
    writeDb(database);
    return audit;
  },
  updateAudit: (id, updates) => {
    const database = readDb();
    const idx = database.audits.findIndex(a => a.id === id);
    if (idx !== -1) {
      database.audits[idx] = { ...database.audits[idx], ...updates };
      writeDb(database);
      return database.audits[idx];
    }
    return null;
  },
  deleteAudit: (id) => {
    const database = readDb();
    const originalLength = database.audits.length;
    database.audits = database.audits.filter(a => a.id !== id);
    writeDb(database);
    return database.audits.length < originalLength;
  }
};
