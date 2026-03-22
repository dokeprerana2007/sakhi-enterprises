import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../backend/config/db.js';
import Admin from '../backend/models/Admin.js';

async function run() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.env.ADMIN_NAME || process.argv[4] || 'Admin';

  if (!email || !password) {
    console.error('Usage: node scripts/createAdmin.mjs <email> <password> [name] OR set ADMIN_EMAIL & ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  await connectDB();

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    // Hash password here and insert raw document to avoid mongoose pre-save hook issues
    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    const doc = { name, email, password: hashed, role: 'admin', createdAt: new Date(), updatedAt: new Date() };
    await Admin.collection.insertOne(doc);
    console.log('Admin created:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

run();
