const API = "/api/admin";
const getToken = () => localStorage.getItem("adminToken");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export async function loginAdmin(email, password){
  const res = await fetch(`${API}/login`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  return res.json();
}

export function requireAuth(){
  if(!getToken()) location.href = "admin-login.html";
}

export function logout(){ localStorage.removeItem('adminToken'); location.href='admin-login.html'; }

export async function fetchDashboard(){
  const res = await fetch(`${API}/dashboard`,{ headers: authHeaders() });
  if (!res.ok) {
    const error = await res.json();
    console.error('Dashboard fetch error:', error);
    throw new Error(error.message || 'Failed to fetch dashboard');
  }
  return res.json();
}

export async function fetchProducts(){
  const res = await fetch(`${API}/products`,{ headers: authHeaders() });
  if (!res.ok) {
    const error = await res.json();
    console.error('Products fetch error:', error);
    throw new Error(error.message || 'Failed to fetch products');
  }
  return res.json();
}

export async function createProduct(data){
  const res = await fetch(`${API}/products`,{ method:'POST', headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) {
    const error = await res.json();
    console.error('Create product error:', error);
    throw new Error(error.message || 'Failed to create product');
  }
  return res.json();
}

export async function uploadImageFile(file){
  const fd = new FormData();
  fd.append('file', file);
  const headers = { Authorization: `Bearer ${getToken()}` };
  const res = await fetch(`${API}/upload`, { method: 'POST', headers, body: fd });
  if (!res.ok) {
    const error = await res.json();
    console.error('Upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
  return res.json();
}

export async function editProduct(id,data){
  const res = await fetch(`${API}/products/${id}`,{ method:'PUT', headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) {
    const error = await res.json();
    console.error('Edit product error:', error);
    throw new Error(error.message || 'Failed to edit product');
  }
  return res.json();
}

export async function removeProduct(id){
  const res = await fetch(`${API}/products/${id}`,{ method:'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const error = await res.json();
    console.error('Remove product error:', error);
    throw new Error(error.message || 'Failed to remove product');
  }
  return res.json();
}

export async function fetchOrders(){
  const res = await fetch(`${API}/orders`,{ headers: authHeaders() });
  if (!res.ok) {
    const error = await res.json();
    console.error('Orders fetch error:', error);
    throw new Error(error.message || 'Failed to fetch orders');
  }
  return res.json();
}

export async function updateOrderStatus(id,status){
  const res = await fetch(`${API}/orders/${id}/status`,{ method:'PUT', headers: authHeaders(), body: JSON.stringify({status}) });
  if (!res.ok) {
    const error = await res.json();
    console.error('Update order status error:', error);
    throw new Error(error.message || 'Failed to update order status');
  }
  return res.json();
}

export async function fetchUsers(){
  const res = await fetch(`${API}/users`,{ headers: authHeaders() });
  if (!res.ok) {
    const error = await res.json();
    console.error('Users fetch error:', error);
    throw new Error(error.message || 'Failed to fetch users');
  }
  return res.json();
}

export async function deleteUser(id){
  const res = await fetch(`${API}/users/${id}`,{ method:'DELETE', headers: authHeaders() });
  return res.json();
}

export async function changePassword(oldPassword,newPassword){
  const res = await fetch(`${API}/change-password`,{ method:'PUT', headers: authHeaders(), body: JSON.stringify({ oldPassword, newPassword }) });
  return res.json();
}

export function applySavedTheme(){
  const p = localStorage.getItem('admin_theme_primary');
  const s = localStorage.getItem('admin_theme_sidebar');
  if(p) document.documentElement.style.setProperty('--accent', p);
  if(s) document.documentElement.style.setProperty('--sidebar', s);
}

// apply immediately
applySavedTheme();
