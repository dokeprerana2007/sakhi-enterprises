# Sakhi Enterprises 2 — Deep Project Analysis

## 📋 Executive Summary

**Sakhi Enterprises 2** is a Node.js + Express e-commerce platform for packaging materials (boxes, mailers, straps, etc.). It combines a RESTful backend with MongoDB persistence, Razorpay payment integration, and static frontend assets. The platform serves both regular customers and administrators with distinct dashboards and workflows.

---

## 🏗️ Architecture Overview

### Technology Stack
- **Backend Framework**: Node.js + Express (v5.2.1)
- **Database**: MongoDB with Mongoose ORM (v9.0.2)
- **Authentication**: JWT + Bcrypt password hashing
- **Payment Gateway**: Razorpay (v2.9.6)
- **File Uploads**: Multer (v2.0.2)
- **Frontend**: Static HTML/CSS/JS (no build tool)
- **Module System**: ES Modules (ESM)

### Entry Points
```
server.js (main entry)
├── backend/app.js (Express app & middleware setup)
├── backend/config/db.js (MongoDB connection)
├── backend/config/razorpay.js (Payment config)
└── backend/routes/* (All API endpoints)
```

---

## 📂 Project Structure

### Backend Directory
```
backend/
├── app.js                 # Express app factory
├── config/
│   ├── db.js             # MongoDB connection
│   └── razorpay.js       # Razorpay instance factory
├── models/               # Mongoose schemas
│   ├── User.js           # Customer accounts
│   ├── Product.js        # Packaging products
│   ├── Order.js          # Order records
│   ├── Cart.js           # Shopping cart items
│   ├── Admin.js          # Admin accounts
│   ├── Profile.js        # Extended user profiles
│   ├── Contact.js        # Contact form submissions
│   └── Payment.js        # Payment records (appears unused)
├── routes/               # API route definitions
│   ├── authRoutes.js     # User signup/login/logout
│   ├── cartRoutes.js     # Cart operations
│   ├── orderRoutes.js    # Order placement & tracking
│   ├── paymentRoutes.js  # Razorpay integration
│   ├── productRoutes.js  # Product catalog
│   ├── adminRoutes.js    # Admin CRUD operations
│   ├── checkoutRoutes.js # Checkout workflow
│   ├── contactRoutes.js  # Contact form endpoints
│   └── profileRoutes.js  # User profile management
├── controllers/          # Request logic implementations
│   ├── authController.js
│   ├── cartController.js
│   ├── orderControllers.js
│   ├── paymentController.js
│   ├── profileController.js
│   ├── adminController.js
│   └── contactController.js
├── middleware/           # Express middleware
│   ├── authMiddleware.js       # User auth (cookie-based)
│   └── adminAuthMiddleware.js  # Admin auth (JWT-based)
└── utils/
    ├── importStaticProducts.js # Product seeding from product.js
    ├── sse.js                  # Server-Sent Events for real-time updates
    └── upload.js               # Multer file upload config
```

### Frontend Directory
```
public/
├── index.html            # Landing page
├── login.html
├── signup.html
├── profile.html          # User profile page
├── contact.html
├── about.html
├── forgot.html           # Password reset page
├── Admin/                # Admin dashboard
│   ├── admin-dashboard.html
│   ├── admin-login.html
│   ├── admin-orders.html
│   ├── admin-products.html
│   ├── admin-settings.html
│   ├── admin-users.html
│   ├── admin.js (admin dashboard logic)
│   └── admin.css
├── assets/
│   ├── js/
│   │   ├── scriptH.js (header/nav logic)
│   │   └── about.js
│   └── styles/
│       ├── styleH.css (header styles)
│       └── about.css
├── product/              # Product catalog
│   ├── product.html
│   ├── product.js        # Product listing logic
│   ├── product.css
│   ├── checkout.html
│   ├── cart.html
│   ├── myorders.html
│   ├── ordertrack.html
│   ├── success.html
│   ├── cod.avif & other product images
│   └── products.json     # Static product data (currently empty [])
└── uploads/              # Server-side product images

scripts/                   # Utility scripts (Node.js)
├── seedProducts.mjs
├── seedSampleProducts.mjs
├── createAdmin.mjs
├── adminImportRun.mjs
├── exportAndImportProducts.mjs
├── parseAndImportPrices.mjs
├── showProducts.mjs
└── testAdminDelete.mjs
```

---

## 🔌 API Endpoints & Routes

### Authentication Routes (`/authRoutes.js`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/signup` | ❌ | Register new user |
| POST | `/login` | ❌ | User login (sets userId cookie) |
| GET | `/profiledata` | ✅ | Fetch logged-in user data |
| GET | `/logout` | ✅ | Clear user session |
| POST | `/forgot-password` | ❌ | Reset password by email |

**Authentication Mechanism**: Cookie-based (userId stored in httpOnly cookie)

---

### Cart Routes (`/cartRoutes.js`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/cart/add` | ✅ | Add item to cart |
| GET | `/cart` | ✅ | Fetch user's cart |
| GET | `/cart/:id` | ✅ | Get single cart item |
| PUT | `/cart/update/:id` | ✅ | Update item quantity |
| DELETE | `/cart/remove/:id` | ✅ | Remove item from cart |
| DELETE | `/cart/clear` | ✅ | Empty entire cart |

---

### Order Routes (`/orderRoutes.js`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/order/place` | ✅ | Place new order (clears cart) |
| GET | `/my-orders` | ✅ | Retrieve user's orders |
| GET | `/order/:id` | ✅ | Get order details & tracking |

**Order Data Structure**:
```javascript
{
  user: ObjectId (ref User),
  items: [{
    name: String,
    quantity: Number,
    totalPrice: Number,
    image: String,
    status: "CONFIRMED",
    orderDate: Date
  }],
  address: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  totalAmount: Number,
  status: "Placed",
  timestamps: { createdAt, updatedAt }
}
```

---

### Payment Routes (`/paymentRoutes.js`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment completion |

**Note**: Payment verification is minimal (just logs success, no DB update)

---

### Product Routes (`/productRoutes.js`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/stream` | SSE stream for real-time updates |

---

### Admin Routes (`/adminRoutes.js`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/admin/login` | ❌ | Admin login (returns JWT) |
| POST | `/api/admin/register` | ❌* | Register admin (requires ADMIN_SETUP_TOKEN) |
| GET | `/api/admin/dashboard` | ✅ JWT | Get dashboard stats |
| GET | `/api/admin/products` | ✅ JWT | List all products |
| POST | `/api/admin/products` | ✅ JWT | Add new product |
| PUT | `/api/admin/products/:id` | ✅ JWT | Update product |
| DELETE | `/api/admin/products/:id` | ✅ JWT | Delete product |
| GET | `/api/admin/orders` | ✅ JWT | Get all orders |
| PUT | `/api/admin/orders/:id/status` | ✅ JWT | Update order status |
| GET | `/api/admin/users` | ✅ JWT | List all users |
| DELETE | `/api/admin/users/:id` | ✅ JWT | Delete user |
| PUT | `/api/admin/change-password` | ✅ JWT | Change password |
| POST | `/api/admin/upload` | ✅ JWT | Upload product image |
| POST | `/api/admin/import-static-products` | ✅ JWT | Seed products from product.js |

**Admin Authentication**: JWT-based (token in Authorization header or cookies)

---

### Profile Routes (`/profileRoutes.js`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/profile` | ✅ | Get full profile with address |
| PUT | `/api/profile/address` | ✅ | Update/save address |

---

### Contact Routes (`/contactRoutes.js`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/contact` | Save contact form submission |
| GET | `/contact` | Retrieve all contacts |

---

### Static File Serving
- `/` → `public/index.html`
- `/public/*` → Static assets in `public/`
- `/product/*` → Static assets in `product/`
- `/assets/*` → Static assets in `assets/`

---

## 📊 Data Models

### User Model
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  phone: String,
  address: String,
  visit_reason: String,
  timestamps: { createdAt, updatedAt }
}
```

### Product Model
```javascript
{
  name: String (required),
  price: Number (default: 0),
  image: String (primary display image),
  description: String,
  slug: String (unique),
  shortDescription: String,
  category: String,
  subCategory: String,
  materialType: String,
  images: [String] (array of image URLs),
  
  // Variant and customization support
  baseVariants: [{
    label: String,
    price: Number,
    sku: String
  }],
  extraOptions: [{
    label: String,
    priceModifier: Number
  }],
  
  // Meta
  isCustomizable: Boolean (default: false),
  minOrderQty: Number (default: 1),
  stock: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date
}
```

### Cart Model
```javascript
{
  user: ObjectId (ref User),
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  timestamps: { createdAt, updatedAt }
}
```

### Order Model
```javascript
{
  user: ObjectId (ref User),
  items: [ItemSchema],
  address: AddressSchema,
  totalAmount: Number,
  status: String (default: "Placed"),
  timestamps: { createdAt, updatedAt }
}
```

### Admin Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed pre-save),
  role: String (default: "admin"),
  timestamps: { createdAt, updatedAt }
}
```

### Contact Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  message: String,
  timestamps: { createdAt, updatedAt }
}
```

### Profile Model (Partial)
```javascript
{
  userId: ObjectId (ref User),
  address: Object,
  cart: Array,
  orders: Array
}
```

---

## 🔐 Authentication & Authorization

### User Authentication
- **Type**: Cookie-based
- **Flow**: 
  1. User signs up or logs in
  2. Password hashed with bcrypt
  3. On successful login, `userId` stored in **httpOnly cookie**
  4. Cookie auto-sent with requests
  5. Middleware reads cookie to attach user to `req.user`
  
- **Middleware** (`authMiddleware.js`):
  ```javascript
  const userId = req.cookies.userId;
  const user = await User.findById(userId).select("-password");
  req.user = user;
  ```

### Admin Authentication
- **Type**: JWT-based
- **Flow**:
  1. Admin logs in or registers
  2. JWT token issued with admin ID
  3. Token stored in localStorage on frontend
  4. Token sent via `Authorization: Bearer <token>` header or cookies
  5. Middleware verifies JWT and attaches admin to `req.admin`

- **Middleware** (`adminAuthMiddleware.js`):
  ```javascript
  const token = authHeader.split(" ")[1] || req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
  const admin = await Admin.findById(decoded.id);
  ```

---

## 💳 Payment Integration (Razorpay)

### Configuration
- **File**: `backend/config/razorpay.js`
- **Environment Variables Required**:
  ```
  RAZORPAY_KEY_ID=<your_key>
  RAZORPAY_KEY_SECRET=<your_secret>
  ```

### Payment Flow
1. **Frontend** calculates cart total
2. **POST** `/api/payment/create-order` with `{ amount }`
3. **Backend** creates Razorpay order:
   ```javascript
   order = razorpay.orders.create({
     amount: amount * 100,  // in paise
     currency: "INR",
     receipt: "sakhi_rcpt_" + timestamp
   })
   ```
4. **Frontend** displays Razorpay checkout modal
5. **User** completes payment
6. **POST** `/api/payment/verify` with payment details
7. **Backend** logs success (basic implementation)

**Current Limitation**: No permanent record linking orders to payments; verification is minimal.

---

## 🚀 Server Startup Flow

```
1. server.js executes
2. dotenv.config() loads .env variables
3. Import app from backend/app.js
4. Connect to MongoDB via connectDB()
5. Mount /api/payment routes
6. Check if products exist in DB
7. If empty, importStaticProducts() seeds from product.js
8. app.listen(PORT) starts server
```

### Auto-Seeding Behavior
- On startup, if `Product.countDocuments() === 0`:
  - Parses `public/product/product.js` for `products` array
  - Extracts JSON using VM context
  - Bulk writes to MongoDB with `upsert: true`
  - Logs result to console

---

## 🛠️ Key Utilities

### importStaticProducts (`backend/utils/importStaticProducts.js`)
- Reads `product.js` and extracts the hardcoded `products` array
- Parses using Node's `vm` module
- Bulk writes to Product collection
- Used both at startup and via admin endpoint

### SSE (Server-Sent Events) (`backend/utils/sse.js`)
- Maintains a `Set` of connected clients
- `addClient(res)` registers an open response stream
- `broadcast(event, data)` sends SSE messages to all clients
- Used for real-time product updates in admin dashboard

### Upload (`backend/utils/upload.js`)
- Multer configuration for file uploads
- Used by admin to upload product images

---

## 📋 Key Observations & Issues

### ✅ Strengths
1. **Clean separation of concerns**: Controllers, models, routes properly organized
2. **Security**: Password hashing with bcrypt, httpOnly cookies
3. **Flexible product schema**: Supports variants, customization, extra options
4. **Real-time updates**: SSE setup for live product/order updates
5. **Admin panel**: Dedicated admin dashboard with CRUD operations
6. **Payment gateway**: Razorpay integrated for payment processing

### ⚠️ Issues & Areas for Improvement

#### 1. **Authentication Inconsistency**
- **Users** use cookie-based auth
- **Admins** use JWT-based auth
- **Risky**: If JWT secret exposed, all admin sessions compromised
- **Fix**: Consider standardized auth strategy

#### 2. **Minimal Payment Verification**
- Payment verification endpoint logs but doesn't persist payment records
- No link between `Order` and `Payment` models
- `Payment` model exists but appears unused
- **Fix**: Implement proper payment verification and DB updates

#### 3. **Products.json is Empty**
- `products.json` is an empty array `[]`
- All products defined in `product.js` (hardcoded)
- Unclear which is source of truth
- **Fix**: Consolidate into JSON or database seed script

#### 4. **Cart Model Redundancy**
- Cart items stored separately from orders
- After order placement, cart should be cleared but unclear if fully implemented
- **Fix**: Add transaction logic to atomic cart-to-order operation

#### 5. **Error Handling**
- Controllers use inconsistent error responses
- Some use `res.status()` properly, others just `res.send()`
- **Fix**: Standardize error response format

#### 6. **Missing Validations**
- Signup doesn't validate password strength
- No email verification
- Cart quantity not validated against stock
- **Fix**: Add schema validators and middleware

#### 7. **Checkout Route**
- `checkoutRoutes.js` imported in app.js but not found in routes directory
- **Fix**: Create `backend/routes/checkoutRoutes.js` or remove import

#### 8. **CORS Not Configured**
- `cors` package installed but not used
- Potential issues if frontend hosted separately
- **Fix**: Add CORS middleware for production

#### 9. **No Rate Limiting**
- All endpoints exposed to potential brute force
- **Fix**: Add rate limiting middleware

#### 10. **Contact Form**
- No authentication required
- Could lead to spam/DOS
- **Fix**: Add spam prevention (rate limiting, captcha)

#### 11. **Admin Setup Token**
- `ADMIN_SETUP_TOKEN` used for initial admin creation
- Default value `"setup-secret"` insecure
- **Fix**: Use strong random token, rotate after first use

#### 12. **Missing Env File**
- No `.env.sample` provided
- Users might miss required variables
- **Fix**: Create `.env.sample` with all required keys

#### 13. **Mongoose Connection**
- No connection retry logic
- Single failure exits process
- **Fix**: Implement retry mechanism

#### 14. **Frontend-Backend Coupling**
- Frontend paths hardcoded (e.g., `/index.html`)
- No API versioning
- **Fix**: Consider API versioning (`/api/v1/...`)

---

## 📦 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^9.0.2 | MongoDB ORM |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT creation/verification |
| razorpay | ^2.9.6 | Payment gateway |
| multer | ^2.0.2 | File uploads |
| cookie-parser | ^1.4.7 | Cookie parsing |
| cors | ^2.8.5 | CORS (installed but unused) |
| dotenv | ^17.2.3 | Environment variables |

---

## 🎯 Recommended Next Steps

### Immediate (Critical)
1. [ ] Create `.env.sample` with required variables
2. [ ] Fix `checkoutRoutes.js` import (create file or remove)
3. [ ] Implement proper payment verification with DB persistence
4. [ ] Add input validation to all endpoints
5. [ ] Create unified error handling middleware

### Short-term (Important)
6. [ ] Consolidate product data (product.js vs products.json)
7. [ ] Add CORS middleware for production
8. [ ] Implement rate limiting
9. [ ] Standardize authentication strategy
10. [ ] Add email verification for signup

### Medium-term (Enhancement)
11. [ ] Add API documentation (Swagger/OpenAPI)
12. [ ] Implement order status tracking
13. [ ] Add inventory management
14. [ ] Create unit & integration tests
15. [ ] Add logging service (Winston, Pino)

### Long-term (Scale)
16. [ ] Separate backend & frontend (different repos)
17. [ ] Implement caching (Redis)
18. [ ] Add API versioning
19. [ ] Containerize with Docker
20. [ ] CI/CD pipeline setup

---

## 🧪 Testing the Application

### Manual Testing Checklist
```
[ ] User signup with email validation
[ ] User login and cookie persistence
[ ] Add products to cart
[ ] Place order from cart
[ ] View order history and tracking
[ ] Payment flow with Razorpay
[ ] Admin login and dashboard
[ ] Admin CRUD operations on products
[ ] Product image upload
[ ] Contact form submission
[ ] Password reset flow
```

### Running the Server
```bash
npm install
# Create .env file with variables
node server.js  # or: npm start (if script added)
```

---

## 📞 Configuration Checklist

Required environment variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/sakhi
RAZORPAY_KEY_ID=<your_key_id>
RAZORPAY_KEY_SECRET=<your_key_secret>
JWT_SECRET=<random_secret_string>
ADMIN_SETUP_TOKEN=<secure_random_token>
```

---

**Document Generated**: March 2025  
**Project**: Sakhi Enterprises 2 (E-commerce Platform)  
**Status**: Development/MVP Phase
