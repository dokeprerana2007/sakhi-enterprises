import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';

import connectDB from '../backend/config/db.js';
import Product from '../backend/models/Product.js';

async function extractProducts(){
  const file = path.join(process.cwd(),'public','product','product.js');
  const content = await fs.readFile(file,'utf8');
  // search for the fallback products array 'products = ['
  let idx = content.indexOf('products =');
  if (idx === -1) idx = content.indexOf('let products =');
  if (idx === -1) idx = content.indexOf('const products =');
  if (idx === -1) throw new Error('products marker not found in product.js');
  const startBracket = content.indexOf('[', idx);
  if (startBracket === -1) throw new Error('start bracket not found');
  // find matching closing bracket
  let depth = 0; let endIndex = -1;
  for (let i = startBracket; i < content.length; i++){
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { endIndex = i; break; } }
  }
  if (endIndex === -1) throw new Error('end bracket not found');
  const arrayText = content.slice(startBracket, endIndex+1);
  const ctx = {};
  try{
    vm.runInNewContext('products = ' + arrayText + ';', ctx, {timeout:1000});
  }catch(e){
    throw new Error('Failed to evaluate products array: '+e.message);
  }
  const prods = ctx.products || [];
  if(!Array.isArray(prods)) throw new Error('Extracted products is not an array');
  return prods;
}

async function importToDB(products){
  await connectDB();
  if (!Array.isArray(products) || products.length === 0) return { inserted: 0 };
  const ops = products.map(p=>{
    const doc = {
      name: p.name,
      price: p.price || 0,
      description: p.desc || p.description || '',
      images: p.images || (p.image?[p.image]:[]),
      image: (p.images && p.images[0]) || p.image || '',
      category: p.category || '',
      stock: p.stock || 0,
      baseConfig: p.baseConfig || [],
      customSurcharges: p.customSurcharges || {}
    };
    return { updateOne: { filter: { name: doc.name }, update: { $set: doc }, upsert: true } };
  });
  const result = await Product.bulkWrite(ops);
  return result;
}

async function run(){
  try{
    console.log('Extracting products from static file...');
    const products = await extractProducts();
    console.log('Found products:', products.length);
    const outFile = path.join(process.cwd(),'public','product','products.json');
    await fs.writeFile(outFile, JSON.stringify(products, null, 2), 'utf8');
    console.log('Wrote', outFile);
    console.log('Importing into DB...');
    const res = await importToDB(products);
    console.log('Import result:', res && res.result ? res.result : res);
    process.exit(0);
  }catch(err){
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
