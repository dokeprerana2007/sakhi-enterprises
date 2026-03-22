// fetch is built-in in Node.js 18+

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@sakhi.com';
const ADMIN_PASSWORD = 'password123';

async function test() {
  console.log('🧪 Testing Admin API Endpoints\n');
  
  try {
    // Test 1: Login
    console.log('1️⃣ Testing Admin Login...');
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    
    if (!loginRes.ok) {
      console.log('❌ Login failed:', loginRes.status);
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Login successful! Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Test 2: Dashboard
    console.log('\n2️⃣ Testing Dashboard Endpoint...');
    const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: authHeaders
    });
    
    if (!dashRes.ok) {
      const errText = await dashRes.text();
      console.log('❌ Dashboard failed:', dashRes.status, errText);
    } else {
      const dashData = await dashRes.json();
      console.log('✅ Dashboard data:', dashData);
    }
    
    // Test 3: Products
    console.log('\n3️⃣ Testing Products Endpoint...');
    const prodRes = await fetch(`${BASE_URL}/api/admin/products`, {
      headers: authHeaders
    });
    
    if (!prodRes.ok) {
      const errText = await prodRes.text();
      console.log('❌ Products failed:', prodRes.status, errText);
    } else {
      const prodData = await prodRes.json();
      console.log(`✅ Products: ${Array.isArray(prodData) ? prodData.length + ' products' : 'Invalid response'}`);
    }
    
    // Test 4: Orders
    console.log('\n4️⃣ Testing Orders Endpoint...');
    const ordersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: authHeaders
    });
    
    if (!ordersRes.ok) {
      const errText = await ordersRes.text();
      console.log('❌ Orders failed:', ordersRes.status, errText);
    } else {
      const ordersData = await ordersRes.json();
      console.log(`✅ Orders: ${Array.isArray(ordersData) ? ordersData.length + ' orders' : 'Invalid response'}`);
    }
    
    // Test 5: Users
    console.log('\n5️⃣ Testing Users Endpoint...');
    const usersRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: authHeaders
    });
    
    if (!usersRes.ok) {
      const errText = await usersRes.text();
      console.log('❌ Users failed:', usersRes.status, errText);
    } else {
      const usersData = await usersRes.json();
      console.log(`✅ Users: ${Array.isArray(usersData) ? usersData.length + ' users' : 'Invalid response'}`);
    }
    
    console.log('\n✨ All endpoint tests completed!');
    
  } catch (err) {
    console.error('💥 Error during testing:', err.message);
  }
}

test();
