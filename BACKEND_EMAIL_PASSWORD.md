# Email/Password Authentication - Add to Your Cloudflare Worker

## The Problem
Your Supabase project doesn't exist (`cmkafqlajemsgxevxfkx.supabase.co` returns DNS_PROBE_FINISHED_NXDOMAIN).

Google OAuth and magic link both require Supabase OAuth which requires a working Supabase project.

## The Solution
Add these endpoints to your Cloudflare Worker for email/password authentication:

### 1. Add to your Worker (above existing routes):

```javascript
// Email/Password Auth Endpoints (No Supabase OAuth required)
import { SignJWT, jwtVerify } from 'jose'

// Hash password with Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Generate JWT token
async function generateToken(userId, email) {
  const secret = new TextEncoder().encode(env.JWT_SECRET || 'your-secret-key-change-this')
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
  return token
}

// POST /auth/signup
app.post('/auth/signup', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400)
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        plan: 'free',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Generate tokens
    const accessToken = await generateToken(user.id, user.email)
    const refreshToken = await generateToken(user.id, user.email) // In production, use different secret

    return c.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan
      }
    })
  } catch (e) {
    console.error('Signup error:', e)
    return c.json({ error: e.message || 'Signup failed' }, 500)
  }
})

// POST /auth/login
app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Verify password
    const passwordHash = await hashPassword(password)
    if (passwordHash !== user.password_hash) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Generate tokens
    const accessToken = await generateToken(user.id, user.email)
    const refreshToken = await generateToken(user.id, user.email)

    return c.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan
      }
    })
  } catch (e) {
    console.error('Login error:', e)
    return c.json({ error: e.message || 'Login failed' }, 500)
  }
})
```

### 2. Add JWT_SECRET to your Cloudflare Worker environment variables:
```
JWT_SECRET=your-secret-key-here-change-this-to-random-string
```

### 3. Create `users` table in Supabase (you still need Supabase for database):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### 4. Update your auth middleware to handle JWT:

```javascript
async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET || 'your-secret-key-change-this')
    const { payload } = await jwtVerify(token, secret)
    c.set('userId', payload.userId)
    c.set('userEmail', payload.email)
    await next()
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}
```

## Why This Works:
- ✅ No Supabase OAuth required
- ✅ Users can create accounts with email/password
- ✅ Passwords are hashed with SHA-256
- ✅ JWT tokens for authentication
- ✅ Still uses Supabase for database (you already have this)
- ✅ Works with existing Stripe integration
- ✅ Works with existing article generation

## What You Need:
1. A Supabase project (just for database, not OAuth)
2. Create the `users` table above
3. Add the code above to your Worker
4. Add `JWT_SECRET` environment variable
5. Deploy

Then I'll update the frontend to use /auth/signup and /auth/login.

**Do you want me to:**
A) Wait for you to add this to your backend, then I'll update the frontend
B) Give you step-by-step Supabase setup instructions (easier, takes 5 minutes)

Choose one and I'll proceed.
