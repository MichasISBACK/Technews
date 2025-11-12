const Database = require('better-sqlite3');

async function openDb() {
  const db = new Database('./newstech_database.db');
  return db;
}

module.exports = openDb;

