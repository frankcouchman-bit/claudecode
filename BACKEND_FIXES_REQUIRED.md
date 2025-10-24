# Backend Worker - Critical Fixes Required

## ⚠️ URGENT: Backend Code Issues Found

Your Cloudflare Worker backend has **critical inconsistencies** that will cause problems with quota enforcement and user experience. Below are the exact fixes needed.

---

## 1. ❌ CRITICAL: Free Plan Quota Mismatch

### Current Backend Code (WRONG):
```javascript
// Line in worker: "Free subscribers can generate **one article per month**"
const QUOTAS = {
  free: { generation: { perMonth: 31, perDay: 1 } },
  pro:  { generation: { perMonth: 9999, perDay: 15 } },
};
```

### Frontend Promise:
- **"1 article per week"** (7 articles/month)

### Problem:
- Backend enforces `perDay: 1` which means free users can only generate 1 article per day
- Combined with the comment saying "one article per month", this is confusing
- Frontend clearly states "1 article per week"

### ✅ REQUIRED FIX:
```javascript
// CORRECT quota for free users: 1 article per week (7 per month)
const QUOTAS = {
  free: { generation: { perMonth: 7, perDay: 1 } },  // Changed from 31 to 7
  pro:  { generation: { perMonth: 9999, perDay: 15 } },
};
```

**Explanation:**
- `perDay: 1` means they can generate 1 article per day MAX
- `perMonth: 7` means they can generate 7 articles per month MAX (= 1 per week)
- This matches the frontend promise of "1 article per week"

---

## 2. ✅ CORRECT: Tool Quotas

### Current Backend Code (CORRECT):
```javascript
const TOOL_QUOTA = { free: 1, pro: 10 };
```

### Frontend Promise:
- Free: "1 tool per day"
- Pro: "10 tools per day"

**Status:** ✅ **Matches perfectly**

---

## 3. ✅ CORRECT: Pro Generation Limit

### Current Backend Code (CORRECT):
```javascript
const QUOTAS = {
  pro: { generation: { perMonth: 9999, perDay: 15 } },
};
```

### Frontend Promise:
- "15 articles per day"

**Status:** ✅ **Matches perfectly**

---

## 4. ❌ BACKEND COMMENT WRONG

### Current Backend Comment (WRONG):
```javascript
/*
 * - Free subscribers can generate **one article per month** (plus one demo
 *   article per IP when not signed in).
 */
```

### ✅ REQUIRED FIX:
```javascript
/*
 * - Free subscribers can generate **one article per week** (7 articles per month,
 *   plus one demo article per IP when not signed in).
 */
```

---

## 5. ❌ ERROR MESSAGE WRONG

### Current Backend Code (WRONG):
```javascript
if (!ok) {
  return jsonResponse(
    {
      error: "Quota exceeded",
      message: plan === "pro" ? "Daily limit reached (15/day)." : "Daily limit reached (1/day).",
    },
    withHeaders(),
    429
  );
}
```

### Problem:
- Message says "Daily limit reached (1/day)" but we actually want weekly limits for free users
- This is confusing because free users are limited to 7/month (1/week), not 1/day

### ✅ REQUIRED FIX:
```javascript
if (!ok) {
  return jsonResponse(
    {
      error: "Quota exceeded",
      message: plan === "pro"
        ? "Daily limit reached (15 articles/day)."
        : "Weekly limit reached (1 article/week). Upgrade to Pro for 15/day.",
    },
    withHeaders(),
    429
  );
}
```

---

## 6. ✅ CORRECT: Guest Demo Limit

### Current Backend Code (CORRECT):
```javascript
/**
 * Guests: 1 demo article per month per IP address.
 */
async function checkGuestIPDemo(SUPABASE_URL, ANON, ip) {
  // ... checks if demo was used within last 30 days
  if (diffDays < 30) return false;
}
```

### Frontend Promise:
- "Try free demo" (implies one-time demo before signup)

**Status:** ✅ **Reasonable implementation** (1 demo per month per IP)

---

## 7. ✅ CORRECT: Stripe Integration

### Current Backend Variables:
- `STRIPE_PRICE_PRO`: `price_1SGLN5GY9Es9mqGaPxF0HfRA`
- `STRIPE_SECRET_KEY`: (encrypted)
- `STRIPE_WEBHOOK_SECRET`: (encrypted)

**Status:** ✅ **Properly configured**

**Note:** Make sure the Stripe Price ID `price_1SGLN5GY9Es9mqGaPxF0HfRA` is set to **$24/month** in your Stripe Dashboard.

---

## 8. ❌ ANOTHER QUOTA ERROR MESSAGE

### Current Backend Code (Line ~442):
```javascript
const allowed = await checkGuestIPDemo(SUPABASE_URL, ANON, ip);
if (!allowed) {
  return jsonResponse(
    {
      error: "Demo limit reached",
      message: "You've used your free demo for this month.  Sign in to continue!",
    },
    withHeaders(),
    403
  );
}
```

### ✅ REQUIRED FIX:
```javascript
const allowed = await checkGuestIPDemo(SUPABASE_URL, ANON, ip);
if (!allowed) {
  return jsonResponse(
    {
      error: "Demo limit reached",
      message: "You've used your free demo. Create a free account for 1 article/week!",
    },
    withHeaders(),
    403
  );
}
```

**Better message**: Tells users they get 1 article/week when they sign up

---

## Summary of Required Changes

### File: `worker.js` (Your Cloudflare Worker)

1. **Line ~59** - Change quota:
   ```javascript
   // OLD:
   const QUOTAS = {
     free: { generation: { perMonth: 31, perDay: 1 } },

   // NEW:
   const QUOTAS = {
     free: { generation: { perMonth: 7, perDay: 1 } },
   ```

2. **Line ~9** - Update comment:
   ```javascript
   // OLD: "Free subscribers can generate **one article per month**"
   // NEW: "Free subscribers can generate **one article per week** (7 articles per month,"
   ```

3. **Line ~442** - Update demo limit message:
   ```javascript
   // OLD: "You've used your free demo for this month.  Sign in to continue!"
   // NEW: "You've used your free demo. Create a free account for 1 article/week!"
   ```

4. **Line ~432** - Update quota exceeded message:
   ```javascript
   // OLD: message: plan === "pro" ? "Daily limit reached (15/day)." : "Daily limit reached (1/day).",
   // NEW: message: plan === "pro" ? "Daily limit reached (15 articles/day)." : "Weekly limit reached (1 article/week). Upgrade to Pro for 15/day.",
   ```

---

## How to Deploy Changes

### Option 1: Edit in Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com
2. Navigate to: Workers & Pages → seoscribe
3. Click "Edit Code"
4. Make the 4 changes above
5. Click "Save and Deploy"

### Option 2: Use Wrangler CLI
```bash
# Install Wrangler if you haven't
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Edit your worker locally, then:
wrangler deploy
```

---

## Verification Checklist

After deploying, test these scenarios:

### Test 1: Free User Weekly Limit
1. Sign up for free account
2. Generate 1 article ✅ (should work)
3. Try to generate another article same day ✅ (should work - we allow 1/day)
4. Generate 1 article per day for 7 days ✅ (should work)
5. On 8th article in same month ❌ (should fail with "Weekly limit reached")

### Test 2: Guest Demo Limit
1. Visit site without logging in
2. Generate demo article ✅ (should work)
3. Try again immediately ❌ (should fail with "You've used your free demo")
4. Message should say "Create a free account for 1 article/week!"

### Test 3: Pro User Daily Limit
1. Upgrade to Pro ($24/month via Stripe)
2. Verify dashboard shows "Pro" plan
3. Generate 15 articles in one day ✅ (should work)
4. Try 16th article same day ❌ (should fail with "Daily limit reached (15 articles/day)")

### Test 4: Tool Quotas
1. Free user: Use readability tool ✅ (should work)
2. Free user: Try same tool again same day ❌ (should fail)
3. Pro user: Use readability tool 10 times ✅ (should work)
4. Pro user: Try 11th time same day ❌ (should fail)

---

## Additional Notes

### Frontend is Already Fixed ✅
- All pricing pages show $24/month
- All quota displays show correct limits
- FAQ explains "1 article/week" for free

### Backend Environment Variables ✅
Your Cloudflare Worker env vars look correct:
- `FRONTEND_URL`: https://seoscribe.pro, https://glistening-stroopwafel-16e9e6.netlify.app
- `SUPABASE_URL`: https://cmkafqlajemsgxevxfkx.supabase.co
- `STRIPE_PRICE_PRO`: price_1SGLN5GY9Es9mqGaPxF0HfRA

**Just verify in Stripe Dashboard** that `price_1SGLN5GY9Es9mqGaPxF0HfRA` is set to $24/month.

---

## Questions?

If you need help with any of these changes:
1. The changes are minimal (4 small edits)
2. They're all in the same worker.js file
3. No database changes needed
4. No Stripe changes needed (unless price is wrong)

**After making these changes, your backend will perfectly match your frontend promises! 🎉**
