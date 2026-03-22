import dotenv from 'dotenv';
dotenv.config();

const API = `http://localhost:${process.env.PORT||3000}`;
const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'StrongP@ssw0rd';

async function run(){
  try{
    console.log('Logging in as', email);
    const loginRes = await fetch(`${API}/api/admin/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    const lj = await loginRes.json();
    if(!lj.token){ console.error('Login failed:', lj); process.exit(1); }
    const token = lj.token;
    console.log('Calling import endpoint...');
    const res = await fetch(`${API}/api/admin/import-static-products`, { method:'POST', headers:{ Authorization: 'Bearer '+token } });
    const j = await res.json();
    console.log('Import response:', j);
  }catch(err){ console.error('Error:', err); process.exit(1); }
}

run();
