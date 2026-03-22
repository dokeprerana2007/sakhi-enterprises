import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../backend/config/db.js';
import Product from '../backend/models/Product.js';

async function run(){
  const file = 'public/product/product.js';
  const content = await fs.readFile(file,'utf8');
  // Regex to match product object with name and price (approximate)
  const regex = /\{([\s\S]*?)\}/g;
  const matches = [];
  let m;
  while((m = regex.exec(content)) !== null){
    const block = m[1];
    const nameMatch = block.match(/name\s*:\s*['"]([^'"]+)['"]/);
    if(!nameMatch) continue;
    const priceMatch = block.match(/price\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
    if(!priceMatch) continue;
    const name = nameMatch[1].trim();
    const price = Number(priceMatch[1]);
    matches.push({ name, price });
  }
  console.log('Found price mappings:', matches.length);
  if(matches.length===0){ console.log('No mappings found'); process.exit(0); }
  await connectDB();
  for(const p of matches){
    const res = await Product.updateOne({ name: p.name }, { $set: { price: p.price } });
    if(res.matchedCount) console.log('Updated', p.name, p.price);
  }
  console.log('Done');
  process.exit(0);
}

run();
