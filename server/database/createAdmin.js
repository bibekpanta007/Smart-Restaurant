require('dotenv').config({ quiet: true });

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // creates the admin, or resets the password if it already exists
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password_hash = ?, role = 'admin'`,
    [ADMIN_NAME || 'Admin', ADMIN_EMAIL.toLowerCase(), passwordHash, passwordHash]
  );

  console.log(`Admin account is ready: ${ADMIN_EMAIL}`);
  await pool.end();
}

createAdmin().catch((error) => {
  console.error('Could not create the admin account:', error.message);
  process.exit(1);
});