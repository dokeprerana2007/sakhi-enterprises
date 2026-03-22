import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import connectDB from '../backend/config/db.js';
import Product from '../backend/models/Product.js';

async function run(){
  await connectDB();
  const count = await Product.countDocuments();
  const force = process.argv.includes('--force') || process.env.SEED_FORCE === '1';
  if(count>0 && !force){
    console.log('Products already present:', count, '(use --force to reseed)');
    process.exit(0);
  }
  if(count>0 && force){
    console.log('Force reseed requested — clearing existing products');
    await Product.deleteMany({});
  }
  const file = path.join(process.cwd(),'public','product','product.js');
  let content = await fs.readFile(file,'utf8');
  // Extract only the products array literal from the file to avoid running DOM code.
  // look for the first occurrence of 'products = [' which indicates the static array
  // fallback: search for 'products =' then the following '['
  let idx = content.indexOf('products =');
  if (idx === -1) idx = content.indexOf('products=');
  if (idx === -1) { console.error('products marker not found'); process.exit(1); }
  const startBracket = content.indexOf('[', idx);
  if (startBracket === -1) { console.error('start of array not found'); process.exit(1); }
  // find matching closing bracket
  let depth = 0; let endIndex = -1;
  for (let i = startBracket; i < content.length; i++){
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) { endIndex = i; break; }
    }
  }
  if (endIndex === -1) { console.error('could not find end of products array'); process.exit(1); }
  const arrayText = content.slice(startBracket, endIndex+1);
  const vm = await import('vm');
  const ctx = {};
  // evaluate only the array literal
  try{
    vm.runInNewContext('products = ' + arrayText + ';', ctx);
  }catch(e){
    console.error('Failed to evaluate array literal:', e.message);
    // dump a small preview to help debugging
    console.error(arrayText.slice(0,500));
    process.exit(1);
  }
  const prods = ctx.products || [];
  if(!Array.isArray(prods) || prods.length===0){
    console.log('No products found in static file'); process.exit(1);
  }
  // map to Product model shape
  const docs = prods.map(p=>({
    name: p.name,
    price: p.price || 0,
    description: p.desc || p.description || '',
    images: p.images || (p.image?[p.image]:[]),
    image: (p.images && p.images[0]) || p.image || '',
    category: p.category || '',
    stock: p.stock || 0,
    baseConfig: p.baseConfig || [],
    customSurcharges: p.customSurcharges || {}
  }));
  await Product.insertMany(docs);
  console.log('Seeded', docs.length, 'products');
  process.exit(0);
}

run();
