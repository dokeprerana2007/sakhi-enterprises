import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import Product from '../models/Product.js';

export async function importStaticProducts() {
  const file = path.join(process.cwd(), 'public', 'product', 'product.js');
  const content = await fs.readFile(file, 'utf8');
  // find 'products' array assignment
  let idx = content.indexOf('products');
  if (idx === -1) idx = content.indexOf('products =');
  if (idx === -1) throw new Error('products marker not found');
  const startBracket = content.indexOf('[', idx);
  if (startBracket === -1) throw new Error('Products array start not found');
  // find matching closing bracket
  let depth = 0;
  let endIndex = -1;
  for (let i = startBracket; i < content.length; i++){
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { endIndex = i; break; } }
  }
  if (endIndex === -1) throw new Error('Products array end not found');
  const arrayText = content.slice(startBracket, endIndex+1);
  const ctx = {};
  vm.runInNewContext('products = ' + arrayText + ';', ctx);
  const prods = ctx.products || [];
  if (!Array.isArray(prods) || prods.length === 0) return { inserted: 0, message: 'no products in static file' };

  const ops = prods.map(p => {
    const doc = {
      name: p.name,
      price: p.price || 0,
      description: p.desc || p.description || '',
      images: p.images || (p.image ? [p.image] : []),
      image: (p.images && p.images[0]) || p.image || '',
      category: p.category || '',
      stock: p.stock || 0,
      baseConfig: p.baseConfig || [],
      customSurcharges: p.customSurcharges || {}
    };
    return {
      updateOne: {
        filter: { name: doc.name },
        update: { $set: doc },
        upsert: true
      }
    };
  });

  const result = await Product.bulkWrite(ops);
  return result;
}
