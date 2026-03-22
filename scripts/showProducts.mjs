import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../backend/config/db.js';
import Product from '../backend/models/Product.js';

async function run(){
  await connectDB();
  const docs = await Product.find().limit(10).lean();
  console.log('Sample products from DB:');
  docs.forEach((d,i)=>{
    console.log('---',i+1,'id:',d._id);
    console.log('name:',d.name);
    console.log('price:',d.price);
    console.log('image:',d.image);
    console.log('images:', Array.isArray(d.images)?d.images.length:'-');
    console.log('category:',d.category);
    console.log('baseConfig:', d.baseConfig ? JSON.stringify(d.baseConfig).slice(0,160) : '-');
    console.log('customSurcharges:', d.customSurcharges ? JSON.stringify(d.customSurcharges).slice(0,160) : '-');
  });
  process.exit(0);
}

run();
