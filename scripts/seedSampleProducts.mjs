import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../backend/config/db.js';
import Product from '../backend/models/Product.js';

const samples = [
  { name: 'Sample Box A', price: 40, description: 'Sample box A description', image: '', category: 'Boxes', stock: 10 },
  { name: 'Sample Box B', price: 80, description: 'Sample box B description', image: '', category: 'Boxes', stock: 20 },
  { name: 'Sample Mailer', price: 15, description: 'Sample mailer', image: '', category: 'Mailers', stock: 100 },
  { name: 'Sample Tape', price: 25, description: 'Sample tape', image: '', category: 'Tapes', stock: 50 },
  { name: 'Sample Wrap', price: 60, description: 'Sample wrap', image: '', category: 'Wrap', stock: 30 }
];

async function run(){
  await connectDB();
  // insertOrUpdate
  const ops = samples.map(p=>({ updateOne: { filter: { name: p.name }, update: { $set: p }, upsert: true } }));
  const res = await Product.bulkWrite(ops);
  console.log('Seeded sample products:', res.result || res);
  process.exit(0);
}

run();
