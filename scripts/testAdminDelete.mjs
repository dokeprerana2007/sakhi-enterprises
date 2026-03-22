import dotenv from 'dotenv';
dotenv.config();

const API = `http://localhost:${process.env.PORT||3000}`;
async function run(){
  try{
    const res = await fetch(`${API}/api/products`);
    const products = await res.json();
    console.log('Products before:', Array.isArray(products)?products.length: 'not-array');
    if(!Array.isArray(products) || products.length===0){ console.log('No products to delete'); process.exit(0); }
    const id = products[0]._id || products[0].id;
    console.log('Deleting product id:', id);
    // login
    const login = await fetch(`${API}/api/admin/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@example.com', password: process.env.ADMIN_PASSWORD || 'StrongP@ssw0rd' }) });
    const j = await login.json();
    if(!j.token){ console.error('Login failed', j); process.exit(1); }
    const token = j.token;
    // delete
    const del = await fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer '+token } });
    const dj = await del.json();
    console.log('Delete response:', dj);
    const res2 = await fetch(`${API}/api/products`);
    const products2 = await res2.json();
    console.log('Products after:', Array.isArray(products2)?products2.length: 'not-array');
  }catch(err){ console.error('Error', err); process.exit(1); }
}

run();
