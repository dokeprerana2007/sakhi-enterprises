# 🚀 Cash on Delivery + Razorpay Integration Guide

## Overview
Your Sakhi Enterprises platform now supports **two payment methods**:
1. **Cash on Delivery (COD)** - Pay when order is delivered
2. **Online Payment (Razorpay)** - Pay now using cards, UPI, wallets, etc.

---

## 📋 What Was Changed

### Backend Changes
#### 1. Order Model (`backend/models/Order.js`)
Added payment fields to track payment method and status:
```javascript
paymentMethod: { type: String, enum: ["ONLINE", "COD"], default: "ONLINE" }
paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" }
razorpayOrderId: String
razorpayPaymentId: String
razorpaySignature: String
status: { type: String, enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] }
```

#### 2. Payment Routes (`backend/routes/paymentRoutes.js`)
**New Endpoints:**
- `POST /api/place-order` - Create order (COD or ONLINE)
- `POST /api/verify-payment` - Verify Razorpay payment for ONLINE orders
- Legacy endpoints preserved for backward compatibility

**COD Flow:**
- User selects "Cash on Delivery"
- Order is created immediately with `paymentStatus: "PENDING"`
- NO Razorpay interaction
- Cart is cleared
- User redirected to success page

**Online Flow:**
- User selects "Pay Online"
- Razorpay order is created on backend
- Order saved with `paymentStatus: "PENDING"`
- Razorpay popup opens on frontend
- After payment success, payment is verified
- Order status updated to `paymentStatus: "PAID"`
- Cart cleared
- User redirected to success page

#### 3. App Configuration (`backend/app.js`)
```javascript
import paymentRoutes from "./routes/paymentRoutes.js";
app.use("/api", paymentRoutes);  // Mounts at /api endpoint
```

### Frontend Changes

#### 1. Checkout Page (`public/product/checkout.html`)
**Added:** Payment method selector
```html
<h2>Payment Method</h2>
<label>
  <input type="radio" name="paymentMethod" value="ONLINE" checked>
  <strong>💳 Pay Online (Razorpay)</strong>
  <p>Instant payment, secure & fast. Credit/Debit cards, UPI, Wallets.</p>
</label>
<label>
  <input type="radio" name="paymentMethod" value="COD">
  <strong>🚚 Cash on Delivery</strong>
  <p>Pay when you receive your order. No prepayment needed.</p>
</label>
```

**Updated:** Payment handler JavaScript
```javascript
// Reads selected payment method
const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

// COD Path: POST to /api/place-order → Direct order creation
// ONLINE Path: POST to /api/place-order → Razorpay popup → Verify payment
```

#### 2. Success Page (`public/product/success.html`)
**Enhanced to show:**
- Order ID from URL parameter
- Payment method selected (COD vs Online)
- COD-specific warning: "Please keep ₹ ready for payment on delivery"
- "Track Your Order" button with orderId parameter

---

## 🧪 Testing Instructions

### Prerequisites
Start your server:
```bash
npm install
node server.js
```

Ensure `.env` has:
```
MONGO_URI=<your-mongodb-uri>
RAZORPAY_KEY_ID=rzp_test_<your-test-key>
RAZORPAY_KEY_SECRET=<your-test-secret>
PORT=3000
```

### Test COD Flow
1. Navigate to your store and add products to cart
2. Go to checkout
3. **Select "Cash on Delivery"**
4. Review order details
5. Click "Place Order" button
6. Should see success page with:
   - ✓ Order ID displayed
   - ✓ "Cash on Delivery (COD)" shown
   - ✓ Warning: "Please keep ₹ ready for payment on delivery"
7. Check MongoDB - Order should have:
   - `paymentMethod: "COD"`
   - `paymentStatus: "PENDING"`
   - `status: "PLACED"`

### Test Online Payment Flow
1. Navigate to your store and add products to cart
2. Go to checkout
3. **Select "Pay Online (Razorpay)"** (default)
4. Review order details
5. Click "Place Order" button
6. Razorpay checkout popup appears
7. Use Razorpay test card: **4111 1111 1111 1111**
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)
8. Complete payment
9. Should see success page with:
   - ✓ Order ID displayed
   - ✓ "Online Payment (Razorpay)" shown
   - ✓ No warning message (just success)
10. Check MongoDB - Order should have:
    - `paymentMethod: "ONLINE"`
    - `paymentStatus: "PAID"`
    - `status: "PLACED"` or `"CONFIRMED"`
    - `razorpayPaymentId` populated

---

## 📊 Order Status Flow

### For COD Orders
```
PLACED (paymentStatus: PENDING)
    ↓
[Admin sees pending COD payment]
    ↓
[Delivery person collects payment]
    ↓
[Admin marks as PAID in dashboard - potentially with SMS/email]
    ↓
CONFIRMED / SHIPPED / DELIVERED
```

### For Online Orders
```
PLACED (paymentStatus: PENDING)
    ↓
[User pays via Razorpay]
    ↓
CONFIRMED (paymentStatus: PAID)
    ↓
SHIPPED
    ↓
DELIVERED
```

---

## 🔌 API Endpoints Reference

### Create Order
**POST** `/api/place-order`

Request:
```json
{
  "paymentMethod": "COD",
  "address": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "items": [
    {
      "_id": "650abc123def456",
      "name": "Product Name",
      "price": 500,
      "quantity": 2
    }
  ],
  "totalAmount": 1000
}
```

Response (COD):
```json
{
  "success": true,
  "message": "Order placed with Cash on Delivery",
  "orderId": "650xyz789"
}
```

Response (Online):
```json
{
  "success": true,
  "message": "Razorpay order created",
  "orderId": "650xyz789",
  "razorpayOrder": {
    "id": "order_1234567890",
    "amount": 100000,
    "currency": "INR"
  }
}
```

### Verify Payment
**POST** `/api/verify-payment`

Request:
```json
{
  "orderId": "650xyz789",
  "razorpayPaymentId": "pay_1234567890",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

Response:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "650xyz789"
}
```

---

## 🛠️ Future Enhancements

### Phase 2 (Admin Dashboard)
- [ ] Admin panel showing COD orders waiting for payment
- [ ] Dashboard stats: COD pending, Online completed, etc.
- [ ] Mark COD as paid when money received
- [ ] SMS/Email to user when payment status changes

### Phase 3 (Customer Features)
- [ ] Payment history in user profile
- [ ] Retry failed payments
- [ ] Download invoice (COD or Online)
- [ ] Request refund

### Phase 4 (More Payment Methods)
- [ ] Razorpay QR codes for UPI
- [ ] Wallet integration
- [ ] Bank transfer option

---

## ⚠️ Important Notes

1. **Security**: 
   - Always verify Razorpay signatures on backend (already implemented)
   - Use HTTPS in production
   - Never expose RAZORPAY_KEY_SECRET in frontend

2. **Testing**:
   - Razorpay test mode is enabled by default
   - Test card: 4111 1111 1111 1111 (always succeeds)
   - Any expiry date and CVV work in test mode

3. **Production Deployment**:
   - Switch to live Razorpay keys in production
   - Update `.env` with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from live mode
   - Ensure HTTPS is enabled
   - Test both flows thoroughly before going live

4. **Database**:
   - Old orders in database won't have paymentMethod/paymentStatus fields
   - Add migration script if needed to backfill data
   - New orders automatically get these fields

---

## 📞 Troubleshooting

### Issue: "Cart is empty" error
**Solution**: Ensure cart has items before checkout

### Issue: Razorpay popup doesn't open
**Solution**: Check browser console for errors, verify RAZORPAY_KEY is correct

### Issue: "Order not found" after payment
**Solution**: Check MongoDB to see if order was created, verify orderId matches

### Issue: COD order created but not appearing in success page
**Solution**: Check browser console, verify order was saved to MongoDB

---

## 📁 Files Summary

| File | Changes |
|------|---------|
| `backend/models/Order.js` | Added payment fields |
| `backend/routes/paymentRoutes.js` | New endpoints for COD/Online |
| `backend/app.js` | Mounted payment routes |
| `public/product/checkout.html` | Payment method UI + handler |
| `public/product/success.html` | Order confirmation display |

---

✅ **Integration Complete!** Your Sakhi Enterprises platform now supports both Cash on Delivery and online Razorpay payments.
